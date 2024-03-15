import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';

// 计算过去6个月的日期范围
const getLastSixMonthsDates = () => {
  const dates = [];
  const today = new Date();
  const sixMonthsAgo = new Date(new Date().setMonth(today.getMonth() - 6));

  for (let day = sixMonthsAgo; day <= today; day.setDate(day.getDate() + 1)) {
    dates.push(new Date(day).toISOString().split('T')[0]);
  }

  return dates;
};

// 假设活动数据是随机的（在实际应用中，应该从你的后端API获取）
const getActivityData = (dates) => {
  const activityData = {};
  dates.forEach(date => {
    activityData[date] = Math.floor(Math.random() * 6); // 0到5次观看
  });
  return activityData;
};

// 根据观看次数计算颜色
const getColor = (count) => {
  if (count >= 5) return '#1b5e20'; // 更深
  if (count >= 3) return '#4caf50';
  if (count > 0) return '#81c784';
  return '#c8e6c9'; // 无活动
};

const ActivityGrid = () => {
  const dates = getLastSixMonthsDates();
  const activityData = getActivityData(dates);

  return (
    <Box sx={{ px: 50, py:5 }}> {/* 容器添加padding */}
      <Grid container spacing={1}>
        {dates.map((date, index) => {
          const day = new Date(date).getDate();
          const isFirstDayOfMonth = day === 1;
          return (
            <React.Fragment key={date}>
              {isFirstDayOfMonth && (
                <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }} key={`month-${date}`}>
                  <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                    {new Date(date).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={2} sm={1} style={{ flexGrow: 1 }}>
                <Paper
                  elevation={1}
                  sx={{
                    backgroundColor: getColor(activityData[date]),
                    // paddingTop: '175%', // 调整正方形大小
                    position: 'relative',
                    '&::before': { // 利用::before伪元素实现正方形
                      content: '""',
                      display: 'block',
                      paddingBottom: '100%',
                    }
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem', // 调整字体大小
                    }}
                  >
                    {day}
                  </Typography>
                </Paper>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ActivityGrid;
