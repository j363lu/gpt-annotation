import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { useSelector } from 'react-redux';
import { selectCompleted } from '../app/completedSlice';
import { selectProgress } from '../app/progressSlice';

function LinearProgressWithLabel() {
  const progress = useSelector(selectProgress);
  const completed = useSelector(selectCompleted);

  return (
    <Box sx={{ display: completed ? 'flex' : "none", alignItems: 'center', marginBottom: "50px" }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={progress} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          progress,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default LinearProgressWithLabel;