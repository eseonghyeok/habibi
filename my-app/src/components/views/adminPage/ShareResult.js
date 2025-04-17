import html2canvas from "html2canvas";

async function captureAndShare(targetRef) {
    if (!targetRef.current) return;

    const canvas = await html2canvas(targetRef.current);
    canvas.toBlob(async (blob) => {
        const today = new Date().toISOString().split("T")[0];
        const shareText = [
            `📢 오늘의 경기 결과 (${today}) 📢`,
            "우리팀의 활약을 확인하세요!🔥",
            "",
            "▼ 이 달의 랭킹🥈 확인하기 ▼",
            "https://hbbfc-eseonghyeok.koyeb.app/record/month"
        ].join("\n")
        
        const file = new File([blob], "screenshot.png", { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: "결과 공유",
                    text: shareText
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