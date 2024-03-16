import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// Mock function to represent fetching or computing the number of contributions for each day.
const getContributionsForDay = (dayIndex) => {
  // Return a random number of contributions for demonstration purposes
  return Math.floor(Math.random() * 10);
};

// Determines the color based on the number of contributions
const getDayColor = (count) => {
  if (count === 0) return 'grey.300';
  if (count <= 5) return 'success.light';
  return 'success.main';
};

// Calculate the date for each cell, starting 6 months ago
const getDateForCell = (cellIndex, startDate) => {
  const date = new Date(startDate.getTime());
  date.setDate(startDate.getDate() + cellIndex);
  return date;
};

// Format date as YYYY-MM-DD
const formatDate = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Function to get month name
const getMonthName = (date) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[date.getMonth()];
};

const ContributionsGraph = () => {
  const weeks = 24; // Weeks in 6 months
  const days = 7; // Days in a week
  const totalDays = weeks * days;

  // Calculate the start date: 6 months ago from today
  const today = new Date();
  const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${weeks}, 20px)`, gap: '4px' }}>
        {Array.from({ length: totalDays }).map((_, index) => {
          const cellDate = getDateForCell(index, sixMonthsAgo);
          const contributionsCount = getContributionsForDay(index);
          const formattedDate = formatDate(cellDate);
          // Calculate the column (week) and row (day) for each cell
          const column = Math.floor(index / days) + 1;
          const row = index % days + 1;
          const isNewMonth = index % days === 0 && (index === 0 || cellDate.getMonth() !== getDateForCell(index - days, sixMonthsAgo).getMonth());

          return (
            <React.Fragment key={index}>
              {isNewMonth && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20, // Adjust based on the desired distance above the grid
                    left: `${(column - 1) * 24}px`, // Calculate based on column width + gap
                    color: 'primary.main',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                  }}
                >
                  {getMonthName(cellDate)}
                </Box>
              )}
              <Tooltip title={`${formattedDate}: ${contributionsCount} contributions`}>
                <Box
                  sx={{
                    gridColumn: column,
                    gridRow: row,
                    width: 20,
                    height: 20,
                    borderRadius: '2px',
                    backgroundColor: getDayColor(contributionsCount),
                    '&:hover': {
                      opacity: 0.7,
                    },
                  }}
                />
              </Tooltip>
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};

export default ContributionsGraph;
