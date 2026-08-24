import React from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import CategoryIcon from "@mui/icons-material/Category";
import ExploreIcon from "@mui/icons-material/Explore";

function TravelInsights({ places, city }) {
  const categories = [...new Set(places.map((p) => p.category))];

  return (
    <Card sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          🌍 Travel Insights
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box textAlign="center">
              <ExploreIcon sx={{ color: "#f97316"}} />
              <Typography variant="h5">{places.length}</Typography>
              <Typography variant="body2">Attractions</Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box textAlign="center">
              <CategoryIcon sx={{ color: "#f97316"}}/>
              <Typography variant="h5">{categories.length}</Typography>
              <Typography variant="body2">Categories</Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box textAlign="center">
              <PlaceIcon sx={{ color: "#f97316"}} />
              <Typography variant="h6" noWrap>
                {city}
              </Typography>
              <Typography variant="body2">Destination</Typography>
            </Box>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            Popular categories: {categories.join(", ")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TravelInsights;