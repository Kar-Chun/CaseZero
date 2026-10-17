export function ConservatoryArt({ type }: { type: string }) {
  return (
    <svg
      viewBox="0 0 600 270"
      className={`room-art room-${type}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`glass-${type}`} x2="0" y2="1">
          <stop stopColor="#1e3a39" />
          <stop offset="1" stopColor="#0e1d24" />
        </linearGradient>
      </defs>
      <rect width="600" height="270" fill={`url(#glass-${type})`} />
      <path
        d="M0 70 300 0 600 70M0 155 300 35 600 155M80 0v250M205 0v250M395 0v250M520 0v250M0 245h600"
        fill="none"
        stroke="#5d7a72"
        opacity=".65"
      />
      <path
        d="M0 270 130 210h340l130 60M300 215v55"
        fill="#0d1c22"
        stroke="#45635e"
      />
      {type === "pump" ? (
        <g>
          <path
            d="M85 220v-55h165v-65h130v120h110"
            fill="none"
            stroke="#748680"
            strokeWidth="15"
          />
          <path
            d="M255 165h160v55"
            fill="none"
            stroke="#b9a77b"
            strokeWidth="9"
          />
          <circle
            cx="330"
            cy="165"
            r="35"
            fill="#172c2b"
            stroke="#b9a77b"
            strokeWidth="4"
          />
          <path
            d="m306 141 48 48m0-48-48 48M330 131v68"
            stroke="#b9a77b"
            strokeWidth="3"
          />
          <rect
            x="410"
            y="88"
            width="55"
            height="90"
            fill="#0c1d24"
            stroke="#6b8d83"
          />
          <path d="M419 110h36M419 129h36M419 148h20" stroke="#a8b1a1" />
        </g>
      ) : type === "study" ? (
        <g>
          <path
            d="m125 210 160-37 180 37-180 40Z"
            fill="#625c47"
            stroke="#a69974"
          />
          <path d="M153 221v49M437 221v49" stroke="#5f6553" strokeWidth="10" />
          <rect
            x="235"
            y="188"
            width="85"
            height="32"
            fill="#bfb79b"
            transform="rotate(-8 235 188)"
          />
          <path
            d="M340 184v-64l36-12M352 105h52l-12 26h-52Z"
            fill="#a19b74"
            stroke="#c0b48b"
          />
          <path
            d="M150 70h62v90h-62ZM153 100h56M153 132h56"
            fill="#152b2c"
            stroke="#687d70"
          />
        </g>
      ) : (
        <g>
          {[type === "potting" ? 190 : 160, type === "potting" ? 340 : 355].map(
            (x, index) => (
              <g key={x}>
                <path
                  d={`M${x - 65} 190h140l30 43H${x - 95}Z`}
                  fill="#3a4a3c"
                  stroke="#8b9170"
                />
                {[0, 1, 2, 3].map((i) => (
                  <g key={i}>
                    <path
                      d={`M${x - 45 + i * 34} 196v-50`}
                      stroke="#8b9a6d"
                      strokeWidth="2"
                    />
                    <path
                      d={`M${x - 45 + i * 34} 170q-24-28-29-15 4 20 29 21m0-24q24-28 29-15-4 20-29 21`}
                      fill={index ? "#587659" : "#78906a"}
                    />
                  </g>
                ))}
                <path d={`M${x - 80} 238h166`} stroke="#579499" opacity=".6" />
              </g>
            ),
          )}
          {type === "potting" && (
            <path
              d="M470 100h54v106h-54ZM476 136h42M476 174h42"
              fill="#364a3e"
              stroke="#a3a281"
            />
          )}
        </g>
      )}
      <path d="M310 0 230 250h180Z" fill="#d2c09b" opacity=".045" />
      <path
        d="M20 256q80-10 130 0t150 0 150 0 150 0"
        fill="none"
        stroke="#6b9ca0"
        opacity=".4"
      />
    </svg>
  );
}
