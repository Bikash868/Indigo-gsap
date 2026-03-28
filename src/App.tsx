import "./App.css";
import PlaneAnimation from "./PlaneAnimation";

function App() {
  return (
    <>
      <div className="content">
        <PlaneAnimation/>
        <div className="loading">INDIGO</div>
        <div className="trigger"></div>
        <div className="section hero-section">
          <div className="brand-tag">IndiGo Airlines</div>
          <h1>Born to fly.</h1>
          <h3>India's favourite airline.</h3>
          <p>On time. Low fares. Courteous. Hassle-free. That's the IndiGo promise, every single flight.</p>
          <div className="scroll-cta">Scroll</div>
        </div>

        <div className="section section-indigo right">
          <h2>More than just a seat.</h2>
          <p>It's a window to the clouds, a shortcut through the sky, and the fastest way to "I'm home."</p>
        </div>

        <div className="ground-container">
          <div className="parallax ground"></div>
          <div className="section right">
            <h2>We leave the ground.</h2>
            <p>Every 7 seconds, somewhere in India.</p>
          </div>

          <div className="section">
            <h2>Across the sky.</h2>
            <p>Connecting 80+ destinations, coast to coast.</p>
          </div>

          <div className="section right">
            <h2>At 35,000 feet.</h2>
            <p>Where the horizon bends and the world feels small.</p>
          </div>
          <div className="parallax clouds"></div>
        </div>

        <div className="section section-light right">
          <h2>How does it work?</h2>
          <p>Two engines. Two wings. 300 million years of aerodynamics. And a team that makes it look easy.</p>
        </div>

        <div className="fun-facts">
          <div className="section fact-section">
            <h2>1,800+</h2>
            <p>Daily flights. More than any other airline in India. Every single day.</p>
          </div>
          <div className="section fact-section right">
            <h2>100M+</h2>
            <p>Passengers carried annually. That's larger than most countries.</p>
          </div>
        </div>

        <div className="blueprint">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <line
              id="line-length"
              x1="10"
              y1="80"
              x2="90"
              y2="80"
              strokeWidth="0.5"
            ></line>
            <path
              id="line-wingspan"
              d="M10 50, L40 35, M60 35 L90 50"
              strokeWidth="0.5"
            ></path>
            <circle
              id="circle-phalange"
              cx="60"
              cy="60"
              r="15"
              fill="transparent"
              strokeWidth="0.5"
            ></circle>
          </svg>
          <div className="section dark">
            <h2>The fleet specs.</h2>
            <p>Airbus A320neo & A321neo — engineered for efficiency.</p>
          </div>
          <div className="section dark length">
            <h2>Length.</h2>
            <p>37.57 metres. Every centimetre optimised for performance.</p>
          </div>
          <div className="section dark wingspan">
            <h2>Wing Span.</h2>
            <p>35.80 metres tip to tip. Sharklet winglets for 4% fuel savings.</p>
          </div>
          <div className="section dark phalange">
            <h2>Range</h2>
            <p>6,300 km. Delhi to London, nonstop.</p>
          </div>
          <div className="section dark">
            <h2>Engines</h2>
            <p>CFM LEAP-1A. 15% more fuel efficient, 50% quieter.</p>
          </div>
          <div className="section dark altitude">
            <h2>Altitude</h2>
            <p>39,100 feet. Above the weather, above the noise.</p>
          </div>
          <div className="section dark">
            <h2>Capacity</h2>
            <p>Up to 236 passengers. Every seat, a window to the world.</p>
          </div>
        </div>

        <div className="history">
          <div className="section">
            <h2>Our story.</h2>
            <p>From one plane and one route in 2006 to India's largest airline. Built on punctuality and trust.</p>
          </div>
          <div className="section right">
            <h2>2006</h2>
            <p>First flight: Delhi to Imphal. One aircraft, one big dream.</p>
          </div>
          <div className="section">
            <h2>Today</h2>
            <p>380+ aircraft. 80+ destinations. The largest airline in India by market share.</p>
          </div>
        </div>

        <div className="sunset">
          <div className="section"></div>
          <div className="section end">
            <h2>Let's go.</h2>
            <p className="farewell">The sky isn't the limit. It's just the beginning.</p>
            <ul className="credits">
              <li>
                Plane model by{" "}
                <a
                  href="https://poly.google.com/view/8ciDd9k8wha"
                  target="_blank"
                >
                  Google Poly
                </a>
              </li>
              <li>
                Animated using{" "}
                <a href="https://greensock.com/scrolltrigger/" target="_blank">
                  GSAP ScrollTrigger
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
