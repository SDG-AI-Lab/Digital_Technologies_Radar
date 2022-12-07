import type { SliderProps } from 'rc-slider';
import 'rc-tooltip/assets/bootstrap.css';
import './Filter.scss';

// taken from https://slider-react-component.vercel.app/demo/handle
export const handleRender: SliderProps['handleRender'] = (node, props) => (
  <div key={node.key} {...node.props}>
    <div className='handleRender'>{props.value}</div>
  </div>
);
