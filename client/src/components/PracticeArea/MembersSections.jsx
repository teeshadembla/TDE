import react, {useMemo} from "react";
import { useNavigate } from "react-router";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const PersonCard = ({ id,name, title, imageUrl }) => {
    const navigate = useNavigate();

    
    const handleViewProfile = () => {
        
        navigate(`/about/profile/${id}`);
    };


    return(
        <div id="w-dyn-item" className="block box-border text-[#333333] font-[Arial,'Helvetica Neue',Helvetica,sans-serif] text-[14px] leading-[20px] h-[426px] w-[261px] text-left">
            <div onClick={handleViewProfile} id="w-inline-block" className="inline-block box-border bg-transparent text-[rgb(0,0,238)] dmsans-text text-[14px] font-normal leading-[18.2px] h-[426px] w-[261px] max-w-full cursor-pointer text-left" >
                <div id="div-block-75" className="block box-border rounded-t-[8px] text-[rgb(0,0,238)] dmsans-text text-[14px] font-normal leading-[18.2px] h-[261px] w-[261px] overflow-hidden cursor-pointer text-left">
                    <img 
                        src={imageUrl} 
                        alt={name}
                        className="inline-block box-border rounded-t-[8px] text-[rgb(0,0,238)] dmsans-text text-[14px] font-normal leading-[18.2px] h-[261px] w-[261px] max-w-full aspect-square object-cover overflow-clip align-middle cursor-pointer text-left"
                    />
                </div>

                <div id="fellows-card-name-box" className="flex flex-col flex-nowrap justify-between box-border bg-[rgb(38,38,38)] hover:bg-[rgb(0,74,173)] text-[rgb(0,0,238)] dmsans-text text-[14px] group font-normal leading-[18.2px] h-[165px] w-[261px] pt-[15px] pb-[15px] pl-[10px] rounded-b-[8px] cursor-pointer text-left">
                    <h3 id="heading-3" className="block box-border text-white dmsans-text text-[18px] font-bold leading-[21.6px] h-[21.6px] w-[251px] mt-[15.05px] mb-[2.5px] mx-0 cursor-pointer text-left">
                        {name}
                    </h3>
                    <div id="profile-card" className="block box-border text-[rgb(159,159,159)] dmsans-text text-[12px] font-normal leading-[18.2px] h-[18.2px] w-[251px] mb-[10px] pr-[2.5px] cursor-pointer text-left">
                        {title}
                    </div>
                    <button 
                        id="button-primary-leadership"
                        onClick={handleViewProfile}
                        className="flex items-center group-hover:bg-[rgb(6,44,101)] justify-center rounded-[4px] box-border bg-[rgb(71,70,70)] text-[rgb(159,159,159)] dmsans-text text-[14px] font-normal leading-[18.2px] h-[30px] w-[150px] gap-[7px] my-[15px] py-[7px] px-[14px] cursor-pointer text-left"
                    >
                        <h6 id="view-profile" className="flex items-stretch justify-center box-border relative text-white dmsans-text text-[11.9px] font-normal leading-[15.47px] h-[16px] w-[64.3625px] m-0 cursor-pointer text-left z-[1]">View Profile </h6> 
                        <ArrowOutwardIcon fontSize="14px"/>
                    </button>
                </div>
            </div>
        </div>
    )
}


const MembersSections = ({ members = [], chairs = [] }) => {

    const { seniorFellows, fellows, others } = useMemo(() => {

        const sorted = [...members].sort((a, b) =>
            (a.displayName || "").localeCompare(b.displayName || "")
        );

        return {
            seniorFellows: sorted.filter(m => m.displayAs === "senior-fellow"),
            fellows: sorted.filter(m => m.displayAs === "fellow"),
            others: sorted.filter(
                m => !m.displayAs || 
                (m.displayAs !== "senior-fellow" && m.displayAs !== "fellow")
            )
        };

    }, [members]);

    return (
        <div className="flex justify-center bg-black w-full px-[64px] pb-[60px]">
            <div className="flex flex-col items-center w-[1092px] gap-[60px] pt-[60px]">

                <h1 className="text-white text-[35px] font-bold mt-[60px]">
                    Meet The Members
                </h1>

                {/* Chairs */}
                {chairs.length > 0 && (
                    <div className="w-full">
                        <div className="grid gap-[16px] grid-cols-[261px_261px_261px_261px]">
                            {chairs.map(chair => (
                                <PersonCard
                                    key={chair._id}
                                    id={chair._id}
                                    name={chair.displayName}
                                    title={chair.headline}
                                    imageUrl={chair.professionalHeadshotUrl}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Senior Fellows */}
                {seniorFellows.length > 0 && (
                    <div className="w-full">
                        <div className="grid gap-[16px] grid-cols-[261px_261px_261px_261px]">
                            {seniorFellows.map(member => (
                                <PersonCard
                                    key={member._id}
                                    id={member._id}
                                    name={member.displayName}
                                    title={member.headline}
                                    imageUrl={member.professionalHeadshotUrl}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Fellows */}
                {fellows.length > 0 && (
                    <div className="w-full">
                        <div className="grid gap-[16px] grid-cols-[261px_261px_261px_261px]">
                            {fellows.map(member => (
                                <PersonCard
                                    key={member._id}
                                    id={member._id}
                                    name={member.displayName}
                                    title={member.headline}
                                    imageUrl={member.professionalHeadshotUrl}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Members without displayAs */}
                {others.length > 0 && (
                    <div className="w-full">
                        <div className="grid gap-[16px] grid-cols-[261px_261px_261px_261px]">
                            {others.map(member => (
                                <PersonCard
                                    key={member._id}
                                    id={member._id}
                                    name={member.displayName}
                                    title={member.headline}
                                    imageUrl={member.professionalHeadshotUrl}
                                />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default MembersSections;