import { Modal } from 'antd';

export const playerInfo = (player) => (
  <div>
    <p><span style={{ fontWeight: 'bolder' }}>{player.name}</span>, {player.info.alias}({player.info.number})</p>
  </div>
);

export const getPlayerInfo = (player, element) => {
    Modal.info({
      title: '선수 정보',
      content: (
        <div>
          {playerInfo(player)}
          {element}
        </div>
      ),
      okText: '확인'
    });
  }