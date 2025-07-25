import { Modal } from 'antd';

export const playerInfo = (player) => (
  <div>
    <p><span style={{ fontWeight: 'bolder' }}>{player.name}</span>, {player.info.alias}({player.info.number})</p>
  </div>
);

export const getPlayerInfo = (player) => {
    Modal.info({
      title: '선수 정보',
      content: (
        <div>
          {playerInfo(player)}
        </div>
      ),
      okText: '확인'
    });
  }