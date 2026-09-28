import { flags } from 'iso-country-flagss'
export default function FlagStyles({ style, country = "us" }) {
    return (
        {
            "3d_flag": <div style={{ width: "20px", height: "20px" }}>
                <img src={`${flags.get(country, "3d")}`} width={"20px"} style={{ aspectRatio: "3/2" }} />
            </div>,
            "2d_flag": <div style={{ width: "20px", height: "20px" }}>
                <img src={`${flags.get(country, "2d")}`} width={"20px"} style={{ aspectRatio: "3/2" }} />
            </div>,
            "no_flag": <div style={{ width: "20px", height: "20px" }}>
                <img src="/dash-line.png" width={"20px"} />
            </div>
        }[style]
    )
}