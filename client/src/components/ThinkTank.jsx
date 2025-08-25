import react from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';

const ThinkTank = () =>{
    const scripts = [
        {
            title: "Build Knowledge",
            image: "https://static.wixstatic.com/media/49ff1e_d9d4bc6896f64c64ac6a6f1576b59342~mv2.png/v1/fill/w_248,h_240,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Screen%20Shot%202021-07-22%20at%205_40_16%20PM.png",
            content: "We apply the rigor of scientific research to moonshot concepts to help you steer your projects in an uncertain world. Build the critical knowledge pieces for your product and journey with us. Our clients have complimentary access to our knowledge factory, the Center of Excellence on Human-centered Digital Economy.",
        },{
            title: "Convene Experts",
            image: "https://static.wixstatic.com/media/49ff1e_5395d059496f40a29a8a78d24726fab8~mv2.png/v1/fill/w_262,h_262,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Screen%20Shot%202021-07-22%20at%205_41_30%20PM.png",
            content: "We'll convene the top global experts in the industry to support your endeavors. With our guidance and introductions to the right people, you have the optimum setup to shape and achieve your mission and goals. You will have a dedicated engagement team at your side, responsible for project delivery and post-engagement advisory. ",
        },{
            title: "Establish Leadership",
            image: "https://static.wixstatic.com/media/49ff1e_bc60d59374a242d4b5d5d0e6b9b0a703~mv2.png/v1/fill/w_238,h_240,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Screen%20Shot%202021-07-22%20at%205_41_39%20PM.png",
            content: "Acting as a platform to enable next-generation digital technologies, knowledge and economic models, we help you take your business to the next level. With our support, you can drive action toward ambitious goals like substantially and sustainably improving the wellbeing of humankind and the planet. ",
        },
    ]

    return(
        <div className=' flex flex-col items-center bg-[url("https://static.wixstatic.com/media/92dfa2_653345fc92b74470a87a42f0e55c4bf9~mv2.png/v1/fill/w_1901,h_1074,al_c,q_95,usm_0.66_1.00_0.01,enc_avif,quality_auto/92dfa2_653345fc92b74470a87a42f0e55c4bf9~mv2.png")] bg-cover bg-center h-screen w-screen'>  
            <h1 className="text-white text-5xl font-bold text-center px-6 py-4 mt-10">We are your Think - and DO - Tank</h1>
            <h2 className='text-white text-2xl font-sans'>Scientific Rigour meets moonshots</h2>
            <div className='flex items-center justify-evenly'>
                {
                    scripts.map((script, index)=>(
                        <Card sx={{display:"flex",justifyContent: "center",alignItems: "center", backgroundColor: 'black', fontFamily: 'Montserrat', color: "white", width: 300 ,height: 450,margin: 2,padding: 2}} key={index}>
                            <CardContent sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",fontFamily: 'Montserrat'}}>
                                <CardMedia
                                    component="img"
                                    image={script.image} 
                                    alt={script.title}
                                    sx={{
                                        width: 110,
                                        height: 110,
                                        objectFit: 'cover',
                                        borderRadius: 1
                                    }}
                                />
                                <Typography variant="h6">
                                    {script.title}
                                </Typography>
                                <Typography variant="body2">
                                    {script.content}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
        </div>
    )
}

export default ThinkTank;