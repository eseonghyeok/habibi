import html2canvas from "html2canvas";

async function captureAndShare(targetRef, type) {
  if (!targetRef) return;

  const canvas = await html2canvas(targetRef);
  canvas.toBlob(async (blob) => {
    const textArray = [
      process.env.REACT_APP_WEB_SITE,
      "",
    ]
    const today = new Date().toISOString().split("T")[0];
    switch (type) {
      case 'record':
        textArray.push(
          `📢 오늘의 경기 결과 (${today}) 📢`,
          "",
          "",
          "▼ 경기 결과✅ 확인하기 ▼",
          `${process.env.REACT_APP_WEB_SITE}/record/day`,
          "",
          "▼ 월간 랭킹🥈 확인하기 ▼",
          `${process.env.REACT_APP_WEB_SITE}/record/month`,
          "",
          "▼ 연간 랭킹🥇 확인하기 ▼",
          `${process.env.REACT_APP_WEB_SITE}/record/year`,
        );
        break;
      case 'team':
        textArray.push(
          `📢 오늘의 팀 명단 (${today}) 📢`,
          "",
          "",
          "▼ 팀 명단👥 확인하기 ▼",
          `${process.env.REACT_APP_WEB_SITE}/attendance`,
        );
        break;
      default:
        alert("공유할 수 없는 환경입니다.");
        break;
    }

    const file = new File([blob], "screenshot.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "결과 공유",
          text: textArray.join("\n")
        });
      } catch (error) {
        console.error("공유 실패", error);
      }
    } else {
      alert("이미지 공유를 지원하지 않는 환경입니다.");
    }
  });
}

export default captureAndShare;