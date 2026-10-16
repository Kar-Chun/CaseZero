export function RadioRoomArt({ type }: { type: string }) {
  return (
    <svg viewBox="0 0 600 270" className="room-art" aria-hidden="true">
      <rect width="600" height="270" fill="#11232c" />
      <path
        d="M0 0 110 65v150L0 270M600 0 490 65v150l110 55M110 65h380v150H110Z"
        fill="#18313a"
        stroke="#49606a"
      />
      <path
        d="M0 270 110 215h380l110 55M300 215v55"
        fill="#101e29"
        stroke="#3e525b"
      />
      {type === "studio" ? (
        <>
          <rect
            x="163"
            y="90"
            width="268"
            height="83"
            fill="#0c1822"
            stroke="#718188"
          />
          <path
            d="M180 145h30l8-24 9 42 12-58 13 51 9-28 11 17h138"
            fill="none"
            stroke="#a68d60"
          />
          <path
            d="m140 205 150-22 155 22-153 33Z"
            fill="#3a4a51"
            stroke="#9b8b6a"
          />
          {[190, 220, 250, 280, 310, 340, 370].map((x) => (
            <path key={x} d={`M${x} 201v19`} stroke="#b7ae91" strokeWidth="3" />
          ))}
          <path
            d="M325 202v-58l35-18v-20"
            fill="none"
            stroke="#9b8b6a"
            strokeWidth="4"
          />
          <rect x="352" y="84" width="16" height="30" rx="8" fill="#a69b83" />
        </>
      ) : type === "rack" ? (
        <>
          {[175, 300, 425].map((x, i) => (
            <g key={x}>
              <rect
                x={x - 40}
                y="85"
                width="83"
                height="128"
                fill="#0a1821"
                stroke="#718188"
              />
              {[110, 140, 170].map((y) => (
                <g key={y}>
                  <path d={`M${x - 30} ${y}h61`} stroke="#566a73" />
                  <circle
                    cx={x - 24}
                    cy={y + 10}
                    r="3"
                    fill={i === 1 ? "#b69960" : "#5d8d91"}
                  />
                  <path d={`M${x + 17} ${y + 10}h17`} stroke="#a89571" />
                </g>
              ))}
            </g>
          ))}
          <path
            d="M199 184q60 60 101 0t127 0"
            fill="none"
            stroke="#b59863"
            strokeWidth="3"
          />
        </>
      ) : type === "lounge" ? (
        <>
          <rect
            x="158"
            y="88"
            width="153"
            height="99"
            fill="#101c29"
            stroke="#5b7683"
          />
          <path
            d="m163 159 140-58M163 173l140-58M210 92v92"
            stroke="#537281"
            opacity=".5"
          />
          <path d="m300 209 60-19 98 19-64 20Z" fill="#6a6454" />
          <path
            d="M334 197v-22h50v22M337 170q23-18 45 0"
            fill="#121c26"
            stroke="#9a927e"
            strokeWidth="5"
          />
          <path d="M160 193h84v36h-84Z" fill="#3b4a4d" stroke="#6e7d78" />
        </>
      ) : (
        <>
          <rect
            x="152"
            y="87"
            width="132"
            height="105"
            fill="#0d1c28"
            stroke="#5f7985"
          />
          <path d="M155 164h126M205 90v100M250 90v100" stroke="#4a6676" />
          <path d="m150 216 147-33 160 33-154 30Z" fill="#4a4b43" />
          {[210, 275, 340].map((x) => (
            <g key={x} transform={`translate(${x},205) rotate(-9)`}>
              <rect
                x="-22"
                y="-18"
                width="50"
                height="30"
                fill="#adad95"
                opacity=".65"
              />
              <path d="M-14-10H20M-14-3H20M-14 4H10" stroke="#46565c" />
            </g>
          ))}
          <path
            d="M385 185v-55l-24-12M346 118h35"
            stroke="#b89d67"
            strokeWidth="3"
          />
        </>
      )}
      <path d="M300 35 233 235h134Z" fill="#d3bc8c" opacity=".03" />
      <path d="M120 65h360" stroke="#bdad8c" opacity=".5" />
    </svg>
  );
}
