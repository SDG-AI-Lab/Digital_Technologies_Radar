import type { SliderProps } from 'rc-slider';
import 'rc-tooltip/assets/bootstrap.css';

// taken from https://slider-react-component.vercel.app/demo/handle
export const handleRender: SliderProps['handleRender'] = (node, props) => (
  <div key={node.key} {...node.props}>
    <div
      style={{
        display: 'block',
        width: 50,
        marginTop: 12,
        marginLeft: -10
      }}
    >
      {props.value}
    </div>
  </div>
);
