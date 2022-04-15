import { useState, useEffect } from 'react';
// rc-slider from https://slider-react-component.vercel.app
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { handleRender } from './HandleRender';

interface Props {
  min: number;
  max: number;
  onChange?: ((value: number | number[]) => void) | undefined;
  reset: boolean;
}

export const AppRangerSlider: React.FC<Props> = ({
  min,
  max,
  onChange: changeParent,
  reset = false
}) => {
  const [selectedMin, setSelectedMin] = useState<number>(min);
  const [selectedMax, setSelectedMax] = useState<number>(max);

  useEffect(() => {
    if (min) setSelectedMin(min);
    // console.log('min', min);
  }, [min]);

  useEffect(() => {
    if (max) setSelectedMax(max);
    // console.log('max', max);
  }, [max]);

  const onChange = (value: number | number[]) => {
    if (typeof value === 'object') {
      setSelectedMin(value[0]);
      setSelectedMax(value[1]);
    }
  };

  useEffect(() => {
    if (selectedMax && selectedMin && changeParent)
      changeParent([selectedMin, selectedMax]);
  }, [selectedMax, selectedMin]);

  useEffect(() => {
    if (reset) {
      // console.log('will be resetted');
      setSelectedMax(max);
      setSelectedMin(min);
    }
  }, [reset, max, min]);

  return (
    <>
      <Slider
        min={min}
        max={max}
        onChange={onChange}
        range
        defaultValue={[selectedMin, selectedMax]}
        value={[selectedMin, selectedMax]}
        // marks={{ min: min.toString(), max: max.toString() }}
        step={1}
        handleRender={handleRender}
        handleStyle={{
          opacity: 1.0
        }}
        trackStyle={{ backgroundColor: '#3182ce' }}
      />
    </>
  );
};
