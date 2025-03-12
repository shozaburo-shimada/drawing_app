import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, InputAdornment } from "@mui/material/";


interface SettingsPanelProps {
  x: number;
  y: number;
  strokeWidth: number;
  strokeColor: string;
  angle: number;
  onSettingsChange: (settings: { x: number; y: number; strokeWidth: number; strokeColor: string; angle: number }) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ x, y, strokeWidth, strokeColor, angle, onSettingsChange }) => {
  const [localX, setLocalX] = useState(x);
  const [localY, setLocalY] = useState(y);
  const [localStrokeWidth, setLocalStrokeWidth] = useState(strokeWidth);
  const [localStrokeColor, setLocalStrokeColor] = useState(strokeColor);
  const [localAngle, setLocalAngle] = useState(angle);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case 'x':
        setLocalX(Number(value));
        break;
      case 'y':
        setLocalY(Number(value));
        break;
      case 'strokeWidth':
        setLocalStrokeWidth(Number(value));
        break;
      case 'strokeColor':
        setLocalStrokeColor(value);
        break;
      case 'angle':
        setLocalAngle(Number(value));
        break;
      default:
        break;
    }
    onSettingsChange({
      x: localX,
      y: localY,
      strokeWidth: localStrokeWidth,
      strokeColor: localStrokeColor,
      angle: localAngle,
    });
  };

  return (
    <Box id="settings_panel" sx={{ borderLeft: 1, borderColor: '#BBBBBB' }} style={{ padding: '10px', width: '200px', }}>
      <Card className="mb-4">
        <div className="pb-2">
          <h3>座標</h3>
        </div>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <TextField
              //value={Math.round(mousePosition.x)}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" >
                      <div style={{ fontSize: '11px' }}>
                        X
                      </div>
                    </InputAdornment>),
                  style: { fontSize: '13px', height: '25px' },
                },
                /*
                inputLabel: {
                  shrink: false,
                  style: { fontSize: '10px' }
                },
                */
              }}
              margin="dense"
            />
            <TextField
              id="standard-basic"
              //value={Math.round(mousePosition.y)}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" >
                      <div style={{ fontSize: '11px' }}>
                        Y
                      </div>
                    </InputAdornment>),
                  style: { fontSize: '13px', height: '25px' },
                },
              }}
              margin="dense"
            />
          </div>
        </CardContent>
      </Card >
    </Box >
  );
};

export default SettingsPanel;

