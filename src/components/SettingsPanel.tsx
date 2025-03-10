import React, { useState } from 'react';
import { Card, CardContent, TextField } from "@mui/material/";

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
    <div id="settings_panel" style={{ padding: '10px', border: '0px solid black', width: '200px' }}>
      <Card className="mb-4">
        <div className="pb-2">
          <h3>座標</h3>
        </div>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <TextField
                label="X"
                //value={Math.round(mousePosition.x)}
                fullWidth
                InputProps={{ readOnly: true }}
                size="small"
              />
            </div>
            <div>
              <TextField
                label="Y"
                //value={Math.round(mousePosition.y)}
                fullWidth
                InputProps={{ readOnly: true }}
                size="small"
              />
            </div>
          </div>
        </CardContent>
      </Card >
    </div >
    /*
    <div style={{ padding: '10px', border: '0px solid black', width: '200px' }}>
      <h3>Settings</h3>
      <div>
        <label>X:</label>
        <input type="number" name="x" value={localX} onChange={handleInputChange} />
      </div>
      <div>
        <label>Y:</label>
        <input type="number" name="y" value={localY} onChange={handleInputChange} />
      </div>
      <div>
        <label>Stroke Width:</label>
        <input type="number" name="strokeWidth" value={localStrokeWidth} onChange={handleInputChange} />
      </div>
      <div>
        <label>Stroke Color:</label>
        <input type="text" name="strokeColor" value={localStrokeColor} onChange={handleInputChange} />
      </div>
      <div>
        <label>Angle:</label>
        <input type="number" name="angle" value={localAngle} onChange={handleInputChange} />
      </div>
    </div>
    */

  );
};

export default SettingsPanel;