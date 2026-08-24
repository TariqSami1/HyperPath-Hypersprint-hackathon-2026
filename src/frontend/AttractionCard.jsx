import React from 'react';
import { Card, CardContent, Typography, Chip, Link, Stack } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PlaceIcon from '@mui/icons-material/Place';

// Visual card to display a single tourist spot
function AttractionCard({ place }) {
  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        
        {/* Name and Category Badge */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Typography variant="subtitle1" fontWeight="600" lineHeight={1.3}>
            {place.name}
          </Typography>
          <Chip 
            label={place.category} 
            size="small" 
            color="primary" 
            variant="outlined" 
            sx={{ textTransform: 'capitalize' }} 
          />
        </Stack>

        {/* Description - only show if the API actually gave us one */}
        {place.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.85rem' }}>
            {place.description}
          </Typography>
        )}

        {/* Address */}
        {place.address && (
          <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
            <PlaceIcon fontSize="inherit" color="action" />
            <Typography variant="caption" color="text.secondary" noWrap>
              {place.address}
            </Typography>
          </Stack>
        )}

        {/* Map Link */}
        {place.lat && place.lon && (
          <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
            <LocationOnIcon fontSize="inherit" color="action" />
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="caption"
            >
              Map View
            </Link>
          </Stack>
        )}
        
      </CardContent>
    </Card>
  );
}

export default AttractionCard;