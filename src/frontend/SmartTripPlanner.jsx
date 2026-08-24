import React, { useState } from 'react';
import { Card, Typography, TextField, MenuItem, Button, Stack, Box, Chip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EventIcon from '@mui/icons-material/Event';

export default function SmartTripPlanner({ cityName, places }) {
  const [days, setDays] = useState(3);
  const [style, setStyle] = useState('Adventure');
  const [itinerary, setItinerary] = useState(null);

  const handleGeneratePlan = (e) => {
    e.preventDefault();
    
    const availablePlaces = places.length > 0 ? places : [
      { name: 'City Center Landmark' }, 
      { name: 'Historic Museum' }, 
      { name: 'Scenic Viewpoint' }
    ];
    
    const generatedDays = [];
    let placeIndex = 0;

    for (let d = 1; d <= days; d++) {
      const daySpots = [];
      
      for (let s = 0; s < 2; s++) {
        if (availablePlaces[placeIndex]) {
          daySpots.push(availablePlaces[placeIndex].name);
          placeIndex = (placeIndex + 1) % availablePlaces.length;
        }
      }

      generatedDays.push({
        day: d,
        theme: style === 'Adventure' ? 'High Energy & Exploration' : style === 'Relaxation' ? 'Leisure & Scenic Views' : 'Culture & Heritage',
        activities: daySpots.length > 0 ? daySpots : ['Local Sightseeing', 'Evening Walk']
      });
    }

    setItinerary(generatedDays);
  };

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        p: 3, 
        borderRadius: 3, 
        mb: 4, 
        bgcolor: 'background.paper', // Automatically adapts to dark/light theme
        borderColor: 'divider' 
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <AutoAwesomeIcon sx={{ color: '#f97316' }} /> {/* Default Orange Theme */}
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          Smart Trip Planner for {cityName}
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Choose your trip duration and travel style to instantly structure your itinerary using real local attractions.
      </Typography>

      {!itinerary ? (
        <Box component="form" onSubmit={handleGeneratePlan}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
            <TextField
              select
              label="Trip Duration"
              size="small"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              fullWidth
            >
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <MenuItem key={num} value={num}>{num} {num === 1 ? 'Day' : 'Days'}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Travel Style"
              size="small"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              fullWidth
            >
              <MenuItem value="Adventure">Adventure & Sights</MenuItem>
              <MenuItem value="Relaxation">Relaxed & Scenic</MenuItem>
              <MenuItem value="History">History & Culture</MenuItem>
            </TextField>
          </Stack>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ 
              bgcolor: '#f97316', // Orange theme matching website accents
              '&:hover': { bgcolor: '#ea580c' }, 
              textTransform: 'none', 
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            Generate Itinerary ✨
          </Button>
        </Box>
      ) : (
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Chip label={`${days} Days • ${style} Mode`} color="warning" size="small" />
            <Button size="small" onClick={() => setItinerary(null)} sx={{ textTransform: 'none', color: '#f97316' }}>
              Change Plan
            </Button>
          </Stack>

          <Stack spacing={2}>
            {itinerary.map((d) => (
              <Box 
                key={d.day} 
                sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', // Adapts cleanly to dark mode containers
                  borderRadius: 2, 
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EventIcon fontSize="small" sx={{ color: '#f97316' }} />
                    <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                      Day {d.day}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" fontStyle="italic">
                    {d.theme}
                  </Typography>
                </Stack>
                {d.activities.map((act, idx) => (
                  <Typography key={idx} variant="body2" color="text.secondary" sx={{ pl: 3, py: 0.5 }}>
                    • {act}
                  </Typography>
                ))}
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Card>
  );
}