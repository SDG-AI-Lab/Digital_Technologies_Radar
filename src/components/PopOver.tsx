import { PopOverType, useDataState } from '@undp_sdg_ai_lab/undp-radar';

/**
 * @impl example of PopOver
 */
export const PopOver: PopOverType = ({ hoveredItem }) => {
  const {
    state: {
      keys: { titleKey }
    }
  } = useDataState();

  return (
    <div
      style={{
        backgroundColor: 'pink',
        padding: 10,
        boxShadow: '5px 5px 15px 0px rgba(0,0,0,0.25)',
        borderRadius: 10
      }}
    >
      {hoveredItem && hoveredItem[titleKey]}
    </div>
  );
};
