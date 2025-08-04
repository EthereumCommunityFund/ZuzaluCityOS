import { Box, Button, Stack, Typography } from '@mui/material';
import React from 'react';
import { ItemType } from './types';

interface ItemProps {
  item: ItemType;
  isSelected: boolean;
  onSelect: () => void;
  expandedContent?: React.ReactNode;
}

export const Item: React.FC<ItemProps> = ({ item, isSelected, onSelect }) => (
  <Box
    onClick={onSelect}
    sx={{
      p: 2,
      border: '1px solid',
      borderColor: isSelected ? 'primary.main' : 'divider',
      borderRadius: 1,
      cursor: 'pointer',
      bgcolor: isSelected ? 'action.selected' : 'background.paper',
      '&:hover': {
        bgcolor: 'action.hover',
      },
    }}
  >
    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
      {item.name}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {item.description}
    </Typography>
  </Box>
);

interface ConfigPanelProps {
  title: string;
  desc: string;
  needButton?: boolean;
  sx?: any;
  handleOpen?: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  title,
  desc,
  needButton = true,
  sx,
  handleOpen,
}) => (
  <Box sx={sx}>
    <Stack spacing={2} alignItems="center" p={3}>
      <Typography variant="h6" color="white" textAlign="center">
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="rgba(255,255,255,0.7)"
        textAlign="center"
      >
        {desc}
      </Typography>
      {needButton && handleOpen && (
        <Button
          variant="outlined"
          onClick={handleOpen}
          sx={{
            mt: 2,
            color: 'white',
            borderColor: 'rgba(255,255,255,0.3)',
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.5)',
            },
          }}
        >
          Configure
        </Button>
      )}
    </Stack>
  </Box>
);
