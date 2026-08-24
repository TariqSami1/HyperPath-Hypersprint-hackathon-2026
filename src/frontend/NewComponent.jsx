import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Stack,
} from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";

import AttractionCard from "./AttractionCard";
import TravelInsights from "./TravelInsights";
import SmartTripPlanner from "./SmartTripPlanner";

const GEOAPIFY_API_KEY = import.meta.env.VITE_API_KEY;

function NewComponent(props) {
  const searchData = props.searchData;

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityName, setCityName] = useState("Requested City");

  useEffect(() => {
    async function fetchPlaces() {
      try {
        let lat = null;
        let lon = null;
        let city = "Requested City";

        // 1. Safely extract location data from the platform's props
        if (
          searchData &&
          searchData.entities &&
          searchData.entities.length > 0
        ) {
          const geo = searchData.entities[0].entityInfo?.geo;

          if (geo && geo.lat && geo.long) {
            lat = geo.lat;
            lon = geo.long;
            city = geo.city || searchData.entities[0].word;
          }
        }

        const rawQuery = (
          searchData.query ||
          searchData._processedQuery ||
          ""
        ).toLowerCase();

        setCityName(city);

        // Stop if no valid coordinates are found
        if (!lat || !lon) {
          setLoading(false);
          return;
        }

        // 3. Dynamically adjust categories based on the user's specific query intent
        let targetCategory = "tourism.sights,heritage,building.historic";

        if (rawQuery.includes("museum")) {
          targetCategory = "entertainment.museum";
        } else if (
          rawQuery.includes("park") ||
          rawQuery.includes("nature") ||
          rawQuery.includes("garden")
        ) {
          targetCategory = "natural.park,tourism.attraction";
        } else if (
          rawQuery.includes("monument") ||
          rawQuery.includes("historic") ||
          rawQuery.includes("castle")
        ) {
          targetCategory = "building.historic,heritage";
        }

        // 4. Fetch data from Geoapify using a wider 50km radius to capture regional entities properly
        const url = `https://api.geoapify.com/v2/places?categories=${targetCategory}&filter=circle:${lon},${lat},50000&limit=30&apiKey=${GEOAPIFY_API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch attractions");
        }

        const data = await response.json();
        const cleanedPlaces = [];

        // 5. Process and clean the data
        (data.features || []).forEach((item, index) => {
          const p = item.properties || {};
          const categories = p.categories || [];

          if (!p.name) return;

          // Block unwanted commercial categories (food, lodging, shopping)
          const blocked = categories.some(
            (category) =>
              category.startsWith("catering") ||
              category.startsWith("accommodation") ||
              category.startsWith("commercial")
          );

          if (blocked) return;

          // Make the category readable by targeting the most specific subcategory
          let displayCategory = "Attraction";

          const validCats = categories.filter(
            (c) =>
              c.startsWith("tourism.") ||
              c.startsWith("heritage") ||
              c.startsWith("entertainment.museum") ||
              c.startsWith("natural.") ||
              c.startsWith("building.historic")
          );

          if (validCats.length > 0) {
            const mostSpecific = validCats[validCats.length - 1];
            const specificWord = mostSpecific.split(".").pop();

            displayCategory = specificWord.replace(/_/g, " ");
            displayCategory =
              displayCategory.charAt(0).toUpperCase() +
              displayCategory.slice(1);
          }

          cleanedPlaces.push({
            id: p.place_id || index,
            name: p.name,
            category: displayCategory,
            address: p.formatted || "",
            description: p.description || "",
            lat: p.lat,
            lon: p.lon,
          });
        });

        setPlaces(cleanedPlaces);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, [searchData]);

  // Notify the HyperDart platform exactly once when loading completes
  useEffect(() => {
    if (!loading) {
      props?.messageHandlers?.componentLoaded();
    }
  }, [loading, props?.messageHandlers]);

  return (
    <Box sx={{ p: 2, maxWidth: 900, mx: "auto" }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <ExploreIcon sx={{ color: "#f97316", fontSize: 36 }} />

        <Box>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            Attractions in {cityName}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Discover the best places to visit
          </Typography>
        </Box>
      </Stack>

      {/* Travel Insights */}
      {!loading && !error && places.length > 0 && (
        <TravelInsights places={places} city={cityName} />
      )}

      {/* Smart Trip Planner */}
      {!loading && !error && places.length > 0 && (
        <SmartTripPlanner cityName={cityName} places={places} />
      )}

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: "#f97316" }} />
        </Box>
      )}

      {/* Error */}
      {!loading && error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && places.length === 0 && (
        <Alert severity="info">
          No tourist attractions found near {cityName}.
        </Alert>
      )}

      {/* Attractions Grid */}
      {!loading && !error && places.length > 0 && (
        <>
          <Typography variant="h6" fontWeight="bold" mb={2} color="text.primary">
            Top Attractions & Landmarks
          </Typography>

          <Grid container spacing={2}>
            {places.map((place) => (
              <Grid item xs={12} sm={6} key={place.id}>
                <AttractionCard place={place} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Footer */}
      <Box mt={4} textAlign="center">
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          Built by Bhavya Gupta & Tariq Sami
        </Typography>
      </Box>
    </Box>
  );
}

export default NewComponent;