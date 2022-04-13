export const ContentView: React.FC = ({ children }) => (
  <div
    style={{
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      overflow: 'hidden'
    }}
  >
    <div
      style={{ overflowY: 'auto', flex: 1, maxHeight: '100%', display: 'flex' }}
    >
      {children}
    </div>
  </div>
);
