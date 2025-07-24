export const playerInfo = (player) => (
  <div>
    <p><span style={{ fontWeight: 'bolder' }}>{player.name}</span>, {player.info.alias}({player.info.number})</p>
  </div>
);