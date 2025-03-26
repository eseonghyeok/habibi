import html2canvas from "html2canvas";

async function captureAndShare(targetRef) {
    if (!targetRef.current) return;

    const canvas = await html2canvas(targetRef.current);
    canvas.toBlob(async (blob) => {
        const file = new File([blob], "screenshot.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: "오늘의 결과",
                    text: "경기 결과를 공유합니다."
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