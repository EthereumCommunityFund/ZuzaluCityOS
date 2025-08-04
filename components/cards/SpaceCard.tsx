'use client';
import { SPACE_CATEGORIES } from '@/constant';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import * as React from 'react';
import { CheckCircleIcon } from '../icons';

// Constants
const DEFAULT_IMAGES = {
  background:
    'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png',
  logo: 'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png',
} as const;

const CARD_DIMENSIONS = {
  width: 290,
  minHeight: 252,
  maxHeight: 288,
  imageHeight: 106,
  logoSize: 60,
  logoTop: 68,
  logoLeft: 12,
} as const;

export type SpaceCardProps = {
  id?: string;
  bgImage?: string;
  logoImage?: string;
  title?: string;
  categories?: string;
  tagline?: string;
  isJoined: boolean;
  isFollowed: boolean;
};

// Helper function to format categories
const formatCategories = (categories: string): string => {
  if (!categories) return '';

  const categoryArray = categories.split(', ');
  const displayedCategories = categoryArray.slice(0, 2).map((category) => {
    const matchedCategory = SPACE_CATEGORIES.find(
      (cat) => cat.value === category,
    );
    return matchedCategory?.label || category;
  });

  const extraCount = categoryArray.length - 2;
  return extraCount > 0
    ? `${displayedCategories.join(', ')} +${extraCount}`
    : displayedCategories.join(', ');
};

// Helper function to truncate title
const truncateTitle = (title: string, maxLength: number = 26): string => {
  if (!title) return '';
  return title.length > maxLength
    ? `${title.substring(0, maxLength)}...`
    : title;
};

const SpaceCard: React.FC<SpaceCardProps> = ({
  id,
  bgImage = DEFAULT_IMAGES.background,
  logoImage = DEFAULT_IMAGES.logo,
  title,
  categories = '',
  tagline,
  isJoined,
  isFollowed,
}) => {
  return (
    <Link href={`/spaces/${id}`} style={{ textDecoration: 'none' }}>
      <Stack
        width={CARD_DIMENSIONS.width}
        borderRadius="10px"
        bgcolor="#292929"
        sx={{
          ':hover': {
            backgroundColor: '#2d2d2d',
          },
          transition: 'background-color 0.2s ease',
        }}
        border="1px solid rgba(255, 255, 255, 0.1)"
        position="relative"
        minHeight={CARD_DIMENSIONS.minHeight}
        maxHeight={CARD_DIMENSIONS.maxHeight}
      >
        {/* Status Badge */}
        {isJoined && (
          <Box className="absolute right-[10px] top-[10px] z-10 flex items-center gap-[5px] rounded-[4px] border border-b-w-10 bg-[rgba(34,34,34,0.60)] px-[10px] py-[5px] backdrop-blur-[5px]">
            <CheckCircleIcon size={4} />
            <Typography component="span" className="text-[14px] font-[500]">
              {isFollowed ? 'Followed' : 'Joined'}
            </Typography>
          </Box>
        )}

        {/* Background Image */}
        <Box
          sx={{
            backgroundImage: `url(${bgImage})`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
          }}
          height={CARD_DIMENSIONS.imageHeight}
          borderRadius={'10px 10px 0 0'}
          role="img"
          aria-label={`${title} background`}
        />

        {/* Logo Image */}
        <Box
          component="img"
          src={logoImage}
          alt={`${title} logo`}
          height={CARD_DIMENSIONS.logoSize}
          width={CARD_DIMENSIONS.logoSize}
          position="absolute"
          top={CARD_DIMENSIONS.logoTop}
          left={CARD_DIMENSIONS.logoLeft}
          borderRadius={30}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            objectFit: 'cover',
          }}
        />

        {/* Content */}
        <Stack padding="10px" spacing="10px" marginTop="20px">
          <Typography color="white" gutterBottom variant="subtitleS">
            {truncateTitle(title || '')}
          </Typography>

          <Box sx={{ maxHeight: '44px', overflow: 'auto' }}>
            <Typography
              variant="bodyM"
              color="white"
              sx={{
                wordWrap: 'break-word',
                opacity: 0.6,
                lineHeight: '22px',
              }}
            >
              {tagline}
            </Typography>
          </Box>

          <Typography
            color="white"
            variant="caption"
            sx={{
              opacity: 0.5,
              fontSize: '10px',
              letterSpacing: '0.02em',
            }}
          >
            {formatCategories(categories)}
          </Typography>
        </Stack>
      </Stack>
    </Link>
  );
};

export const SpaceCardSkeleton: React.FC = () => {
  return (
    <Stack
      width={CARD_DIMENSIONS.width}
      borderRadius="10px"
      bgcolor="#292929"
      border="1px solid rgba(255, 255, 255, 0.1)"
      position="relative"
      minHeight={CARD_DIMENSIONS.minHeight}
    >
      <Skeleton
        variant="rectangular"
        height={CARD_DIMENSIONS.imageHeight}
        sx={{
          borderRadius: '10px 10px 0 0',
        }}
      />

      <Box
        width={CARD_DIMENSIONS.logoSize}
        height={CARD_DIMENSIONS.logoSize}
        sx={{
          backgroundColor: '#2b2b2b',
          position: 'absolute',
          top: CARD_DIMENSIONS.logoTop,
          left: CARD_DIMENSIONS.logoLeft,
          padding: '5px',
          borderRadius: 30,
        }}
      >
        <Skeleton variant="circular" width={50} height={50} />
      </Box>

      <Stack padding="10px" spacing="10px" marginTop="20px">
        <Skeleton width="40%" height={20} />
        <Skeleton width="90%" height={16} />
        <Skeleton width="60%" height={14} />
      </Stack>
    </Stack>
  );
};

export default SpaceCard;
