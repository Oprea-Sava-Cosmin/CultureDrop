  import { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Chip,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  Button,
  Typography,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';

import { productCategories, culturalThemes } from '../../data/mockData';

interface FilterBarProps {
  onFilterChange: (category: string | null, culture: string | null, searchQuery: string) => void;
  activeCategory: string | null;
  activeCulture: string | null;
  searchQuery: string;
}

const FilterBar = ({
  onFilterChange,
  activeCategory,
  activeCulture,
  searchQuery,
}: FilterBarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Sync local search query with prop when it changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Handle category change
  const handleCategoryChange = (_event: React.SyntheticEvent, newValue: string) => {
    onFilterChange(newValue === 'all' ? null : newValue, activeCulture, localSearchQuery);
  };

  // Handle culture filter change
  const handleCultureChange = (culture: string) => {
    onFilterChange(activeCategory, culture === activeCulture ? null : culture, localSearchQuery);
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(event.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onFilterChange(activeCategory, activeCulture, localSearchQuery);
  };

  // Clear search only
  const clearSearch = () => {
    setLocalSearchQuery('');
    onFilterChange(activeCategory, activeCulture, '');
  };

  // Toggle mobile filter drawer
  const toggleMobileFilter = () => {
    setMobileFilterOpen(!mobileFilterOpen);
  };

  // Clear all filters
  const clearFilters = () => {
    onFilterChange(null, null, '');
    setLocalSearchQuery('');
    setMobileFilterOpen(false);
  };

  const chipVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  // Mobile filter drawer content
  const mobileFilterContent = (
    <Box sx={{ width: 280, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={toggleMobileFilter}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel component="legend">Category</FormLabel>
        <RadioGroup 
          value={activeCategory || 'all'}
          onChange={(e) => onFilterChange(e.target.value === 'all' ? null : e.target.value, activeCulture, searchQuery)}
        >
          <FormControlLabel value="all" control={<Radio />} label="All Products" />
          {productCategories.map((category) => (
            <FormControlLabel 
              key={category} 
              value={category} 
              control={<Radio />} 
              label={category.charAt(0).toUpperCase() + category.slice(1)} 
            />
          ))}
        </RadioGroup>
      </FormControl>
      
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel component="legend">Culture</FormLabel>
        <RadioGroup 
          value={activeCulture || ''}
          onChange={(e) => onFilterChange(activeCategory, e.target.value || null, searchQuery)}
        >
          <FormControlLabel value="" control={<Radio />} label="All Cultures" />
          {culturalThemes.map((culture) => (
            <FormControlLabel 
              key={culture} 
              value={culture} 
              control={<Radio />} 
              label={culture.charAt(0).toUpperCase() + culture.slice(1)} 
            />
          ))}
        </RadioGroup>
      </FormControl>
      
      <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
        <Button variant="contained" onClick={toggleMobileFilter} fullWidth>
          Apply Filters
        </Button>
        <Button variant="outlined" onClick={clearFilters}>
          Clear
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ mb: 4 }}>
      {/* Search and filter bar */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 1 },
          maxWidth: { sm: '500px', md: 'none' },
        }}
      >
        {/* Search form */}
        <Box 
          component="form" 
          onSubmit={handleSearchSubmit}
          sx={{ 
            width: { xs: '100%', sm: 'auto' },
            display: 'flex',
          }}
        >
          <TextField
            size="small"
            placeholder="Search products..."
            value={localSearchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchSubmit(e);
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: localSearchQuery ? (
                <InputAdornment position="end">
                  <IconButton 
                    size="small" 
                    onClick={clearSearch}
                  >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{ width: { xs: '100%', sm: 300 } }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ ml: 1, display: { xs: 'none', sm: 'flex' } }}
          >
            Search
          </Button>
        </Box>

        {/* Mobile filter button */}
        {isMobile && (
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />}
            onClick={toggleMobileFilter}
            fullWidth
          >
            Filters
          </Button>
        )}
      </Box>

      {/* Desktop category tabs */}
      {!isMobile && (
        <Tabs
          value={activeCategory || 'all'}
          onChange={handleCategoryChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          <Tab label="All Products" value="all" />
          {productCategories.map((category) => (
            <Tab 
              key={category} 
              label={category.charAt(0).toUpperCase() + category.slice(1)} 
              value={category} 
            />
          ))}
        </Tabs>
      )}

      {/* Desktop culture filter chips */}
      {!isMobile && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {culturalThemes.map((culture) => (
            <motion.div key={culture} variants={chipVariants} whileHover="hover" whileTap="tap">
              <Chip
                label={culture.charAt(0).toUpperCase() + culture.slice(1)}
                onClick={() => handleCultureChange(culture)}
                color={activeCulture === culture ? 'primary' : 'default'}
                variant={activeCulture === culture ? 'filled' : 'outlined'}
              />
            </motion.div>
          ))}
          {(activeCategory || activeCulture || searchQuery) && (
            <motion.div variants={chipVariants} whileHover="hover" whileTap="tap">
              <Chip
                label="Clear All Filters"
                onClick={clearFilters}
                color="secondary"
                onDelete={clearFilters}
                deleteIcon={<CloseIcon />}
              />
            </motion.div>
          )}
        </Box>
      )}

      {/* Mobile filter drawer */}
      <Drawer
        anchor="right"
        open={mobileFilterOpen}
        onClose={toggleMobileFilter}
      >
        {mobileFilterContent}
      </Drawer>
    </Box>
  );
};

export default FilterBar;