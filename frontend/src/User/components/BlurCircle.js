const BlurCircle = ({ top = "auto", left = "auto", right = "auto", bottom = "auto" }) => {
    return (
        <div 
            // 👇 SỬA Ở ĐÂY: Xóa "-z-50"
            className="absolute h-64 w-64 rounded-full bg-rose-500/30 blur-3xl"
            style={{ 
                top: top, 
                left: left, 
                right: right, 
                bottom: bottom 
            }}
        />
    );
}

export default BlurCircle;