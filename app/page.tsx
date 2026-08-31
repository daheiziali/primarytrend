const profileRows = [
  { y: 72, width: 18, tone: 'low' },
  { y: 110, width: 34, tone: 'mid' },
  { y: 147, width: 53, tone: 'high' },
  { y: 184, width: 82, tone: 'poc' },
  { y: 221, width: 61, tone: 'high' },
  { y: 258, width: 39, tone: 'mid' },
  { y: 295, width: 24, tone: 'low' },
];

const lessons = [
  ['回归中线', '市场在当前趋势结构里的动态均衡价。'],
  ['弯曲 Profile', '统计价格相对趋势线的偏离，而不是固定价格。'],
  ['POC 曲线', '窗口内成交量最集中的相对位置，常形成阶段支撑或压力。'],
  ['SD 通道', '+1 到 +3 标准差用于判断价格偏离程度。'],
];

const scenarios = [
  ['趋势跟随', '只在 Direction 与大级别方向一致时寻找回踩或反弹确认。'],
  ['支撑压力', '观察价格对 POC、回归中线、+/-1SD 的反应强弱。'],
  ['极端偏离', '价格触及 +/-2SD 到 +/-3SD 后，等待量价确认再行动。'],
];

const plans = [
  ['体验版', '¥99', '指标基础模板', '适合先验证风格和盘感'],
  ['专业版', '¥299', '指标 + 交易说明书', '包含参数建议和案例拆解'],
  ['陪跑版', '¥899', '专业版 + 1v1 解读', '适合需要快速搭建体系的用户'],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#18201f]">
      <section className="hero-section">
        <nav className="topbar" aria-label="产品导航">
          <div className="brand-mark">
            <span className="brand-dot" />
            <span>主力潮 Pro</span>
          </div>
          <div className="nav-actions">
            <a href="#demo">Demo</a>
            <a href="#pricing">定价</a>
            <a className="icon-button" href="#pricing" aria-label="立即购买">
              ¥
            </a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Polynomial / Linear Regression Volume Profile</p>
            <h1>把趋势、偏离和主成交区放进同一张图。</h1>
            <p className="hero-lede">
              一套面向 TradingView 用户的付费指标说明页 demo。它将回归通道、
              标准差边界、POC 与弯曲成交量分布统一表达，帮助用户更快读懂趋势结构。
            </p>
            <div className="cta-row">
              <a className="primary-cta" href="#pricing">查看付费方案</a>
              <a className="secondary-cta" href="#demo">打开指标演示</a>
            </div>
          </div>

          <div className="terminal-panel" aria-label="指标核心数值">
            <div className="terminal-head">
              <span />
              <span />
              <span />
            </div>
            <dl>
              <div>
                <dt>Direction</dt>
                <dd>Bullish</dd>
              </div>
              <div>
                <dt>POC Level</dt>
                <dd>18.72</dd>
              </div>
              <div>
                <dt>POC Volume</dt>
                <dd>2.45M</dd>
              </div>
              <div>
                <dt>Channel</dt>
                <dd>H 21.08 / L 15.36</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section id="demo" className="demo-section">
        <div className="section-heading">
          <p className="eyebrow">Interactive Style Demo</p>
          <h2>成交量分布为什么会弯？</h2>
          <p>
            这套指标不是按固定价格统计成交量，而是围绕回归趋势线统计“相对偏离层”。
            趋势线弯曲时，成交量 profile 也会跟随通道弯曲。
          </p>
        </div>

        <div className="chart-shell">
          <div className="chart-toolbar">
            <span>Polynomial</span>
            <span>Period 200</span>
            <span>Rows 20</span>
          </div>
          <div className="chart-stage">
            <div className="sd-label sd-top">+2 SD</div>
            <div className="sd-label sd-mid">POC</div>
            <div className="sd-label sd-bottom">-2 SD</div>
            <svg className="chart-svg" viewBox="0 0 760 380" role="img" aria-label="回归成交量分布示意图">
              <path className="grid-line" d="M34 78 C190 42 302 84 428 61 S628 70 726 36" />
              <path className="grid-line" d="M34 127 C190 91 302 133 428 110 S628 119 726 85" />
              <path className="basis-line" d="M34 178 C190 142 302 184 428 161 S628 170 726 136" />
              <path className="grid-line" d="M34 229 C190 193 302 235 428 212 S628 221 726 187" />
              <path className="grid-line" d="M34 280 C190 244 302 286 428 263 S628 272 726 238" />
              <path className="poc-line" d="M34 201 C190 165 302 207 428 184 S628 193 726 159" />
              <path className="price-line" d="M38 245 C126 198 190 222 256 174 S388 112 474 143 S618 202 720 98" />
              {profileRows.map((row) => (
                <path
                  key={row.y}
                  className={`profile-line ${row.tone}`}
                  d={`M${706 - row.width * 4} ${row.y} C${644 - row.width * 2} ${row.y - 25} ${588 - row.width} ${row.y + 9} 706 ${row.y - 28}`}
                />
              ))}
              <circle className="hot-dot" cx="610" cy="177" r="7" />
            </svg>
            <div className="dashboard-card">
              <strong>Regression Matrix</strong>
              <span>Direction <b>Bullish</b></span>
              <span>POC Level <b>18.72</b></span>
              <span>POC Volume <b>2.45M</b></span>
              <span>High / Low <b>21.08 / 15.36</b></span>
            </div>
          </div>
        </div>
      </section>

      <section className="lesson-grid" aria-label="指标元素解释">
        {lessons.map(([title, body]) => (
          <article key={title} className="info-card">
            <span className="card-index">{title.slice(0, 2)}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <section className="use-section">
        <div className="section-heading compact">
          <p className="eyebrow">Trading Playbook</p>
          <h2>适合放进交易系统，而不是孤立当买卖点。</h2>
        </div>
        <div className="scenario-list">
          {scenarios.map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="pricing-section">
        <div className="section-heading compact">
          <p className="eyebrow">Paid Product</p>
          <h2>把指标卖成一套“可理解、可复盘、可交付”的产品。</h2>
        </div>
        <div className="pricing-grid">
          {plans.map(([name, price, feature, note], index) => (
            <article className={index === 1 ? 'price-card featured' : 'price-card'} key={name}>
              <p>{name}</p>
              <h3>{price}</h3>
              <strong>{feature}</strong>
              <span>{note}</span>
              <a href="#demo">{index === 1 ? '推荐购买' : '选择方案'}</a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
