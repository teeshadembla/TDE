import react from 'react';

const VideoSection = () => {
    return(
        <div className="bg-[#f6f5f5] flex flex-col items-center justify-center w-full h-[794.037px] py-[60px] box-border text-[#333333] font-sans text-[14px] leading-[20px] text-justify">
            <div className="flex flex-row flex-nowrap items-center justify-center mx-[120px] max-w-[1200px] w-[1200px] h-auto min-h-[674.037px] box-border text-[#333333] font-sans text-[14px] leading-[20px] text-justify">
                <div className="relative block w-[1200px] h-0 pt-[674.037px] bg-[url('https://d3e54v103j8qbb.cloudfront.net/static/youtube-placeholder.2b05e7d68d.svg')] bg-center bg-cover box-border text-[#333333] font-sans text-[14px] leading-[20px] text-justify">
                    <iframe allow='autoplay;encrypted-media' src='https://www.youtube.com/embed/yhAkk2fZPIE?rel=0&controls=0&autoplay=1&mute=0&start=0' className="absolute top-0 left-0 w-[1200px] h-[674.037px] pointer-events-auto overflow-clip box-border text-[#333333] font-sans text-[14px] leading-[20px] text-justify border-none"></iframe>
                </div>
            </div>
        </div>
    )
}

export default VideoSection;