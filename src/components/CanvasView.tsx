
import React from 'react';
import { Box } from "@mui/material/";
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import Divider from '@mui/material/Divider';
import { dividerClasses } from '@mui/material/Divider';

interface CanvasViewProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CanvasView: React.FC<CanvasViewProps> = ({ canvasRef }) => {
  return (
    <Box backgroundColor="#f5f5f5" p={2}>
      <Box
        sx={{
          width: 'fit-content',
          margin: '10px',
          display: 'flex',
          alignItems: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.paper',
          color: 'text.secondary',
          '& svg': {
            m: 1,
          },
          [`& .${dividerClasses.root}`]: {
            mx: 0.5,
          },
        }}
      >
        <FormatAlignLeftIcon />
        <FormatAlignCenterIcon />
        <FormatAlignRightIcon />
        <Divider orientation="vertical" flexItem />
        <FormatBoldIcon />
      </Box>
      <canvas
        ref={canvasRef}
        width={891}
        height={530}
        style={{ border: '1px solid black', backgroundColor: 'white' }}
      />
    </Box>
  );
};

export default CanvasView;