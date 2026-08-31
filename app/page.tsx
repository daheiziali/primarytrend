const stats = [
  ['趋势方向', 'Bullish'],
  ['POC 主成交区', '18.72'],
  ['通道边界', '+3SD / -3SD'],
  ['适用周期', '15m - 1D'],
];

const features = [
  ['01', '趋势不是凭感觉看', '用线性/多项式回归拟合当前价格中枢，快速判断行情是在上行、下行还是结构切换。'],
  ['02', '主力成交区一眼定位', 'POC 曲线标记窗口内成交最密集区域，辅助判断支撑、压力和筹码重心。'],
  ['03', '偏离程度量化呈现', '+1SD 到 +3SD 通道展示价格偏离强弱，帮助避免盲目追涨杀跌。'],
  ['04', '成交量分布跟随趋势', 'Profile 不再固定在水平价格，而是围绕趋势通道统计，更适合趋势行情复盘。'],
];

const steps = [
  ['先看方向', 'Dashboard 显示 Bullish / Bearish，先确定交易只顺哪一边。'],
  ['再看位置', '价格处于中线、POC、+/-SD 哪个区域，决定是等待、跟随还是防守。'],
  ['最后看反应', '结合 K 线与成交量，观察关键层级是否承接或受压。'],
];

const logicTabs = ['趋势回踩', 'POC支撑', '极端偏离', '低量穿越'];

const logicCards = [
  ['1. 判断主趋势', '先看回归中线方向和 Dashboard：中线向上优先找回踩承接，中线向下优先找反弹受压。'],
  ['2. 锁定关键层', '重点观察 POC 曲线、回归中线、+/-1SD 区域，它们是行情最容易发生反应的位置。'],
  ['3. 等待量价确认', '价格触及关键层后，不急着追单，等待止跌、放量、假突破回收或反压确认。'],
];

const rights = ['TradingView 指标源码', '中文使用说明书', '参数设置建议', '典型行情案例拆解', '付费用户更新记录'];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <nav className="nav">
          <div className="logo">主力潮 Pro</div>
          <div className="nav-links">
            <a href="#features">核心功能</a>
            <a href="#logic">实战图解</a>
            <a href="#usage">使用方法</a>
            <a href="#buy">立即获取</a>
          </div>
        </nav>

        <div className="hero-inner">
          <div className="hero-copy">
            <p className="label">回归通道成交量分布指标</p>
            <h1>看清趋势里的主力成交区</h1>
            <p className="subtitle">
              把趋势方向、标准差偏离、POC 主成交区和弯曲成交量分布合成一张图，
              让 TradingView 盘面更适合复盘、跟踪和制定交易计划。
            </p>
            <div className="hero-actions">
              <a className="buy-button" href="#buy">立即获取指标</a>
              <a className="ghost-button" href="#demo">查看图形说明</a>
            </div>
            <div className="hero-note">适合股票、期货、外汇、加密货币等趋势型市场观察。</div>
          </div>

          <div id="demo" className="screen-card" aria-label="指标演示图">
            <div className="screen-top">
              <span>主力潮 Pro / Polynomial Regression VP</span>
              <b>LIVE</b>
            </div>
            <div className="chart-area">
              <div className="chart-grid" />
              <div className="curve curve-a" />
              <div className="curve curve-b" />
              <div className="curve curve-c" />
              <div className="curve curve-poc" />
              <div className="price-path" />
              <div className="profile profile-1" />
              <div className="profile profile-2" />
              <div className="profile profile-3" />
              <div className="profile profile-4" />
              <div className="profile profile-5" />
              <div className="chart-tag tag-a">+2 SD</div>
              <div className="chart-tag tag-b">POC Vol 2.45M</div>
              <div className="chart-tag tag-c">-2 SD</div>
              <div className="metric-panel">
                {stats.map(([name, value]) => (
                  <div key={name}>
                    <span>{name}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section dark-section">
        <div className="section-title">
          <p className="label">为什么它和普通成交量分布不同</p>
          <h2>它看的是“趋势通道里的成交量”，不是静态价格。</h2>
        </div>
        <div className="feature-grid">
          {features.map(([num, title, body]) => (
            <article key={num} className="feature-card">
              <span>{num}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="logic" className="logic-section">
        <div className="logic-wrap">
          <div className="logic-title">
            <p className="label">行情图使用逻辑</p>
            <h2>主力潮不是给一个孤立信号，而是帮你拆出交易位置。</h2>
            <p>
              先把行情放进回归通道，再看价格靠近哪一层成交量结构。
              下面用分图展示实际盘面中最常见的两类使用方式。
            </p>
          </div>

          <div className="logic-tabs" aria-label="信号分类">
            {logicTabs.map((item, index) => (
              <span className={index === 0 ? 'active' : ''} key={item}>{item}</span>
            ))}
          </div>

          <div className="logic-panel">
            <div className="logic-copy">
              <div className="logic-badge">绿色区域：多头关注承接位 / 橙色曲线：POC主成交区</div>
              <h3>趋势回踩到主成交区，观察是否形成支撑。</h3>
              <p>
                当回归中线保持上行，价格回踩到 POC 或 -1SD 附近时，
                这里不是简单的“低价”，而是趋势结构里的高换手位置。
              </p>
              <div className="logic-card-list">
                {logicCards.map(([title, body]) => (
                  <article key={title}>
                    <strong>{title}</strong>
                    <span>{body}</span>
                  </article>
                ))}
              </div>
            </div>

            <div className="logic-charts">
              <div className="mini-chart bullish-chart">
                <div className="zone zone-resistance" />
                <div className="zone zone-support" />
                <div className="mini-path path-bull" />
                <div className="mini-poc" />
                <div className="entry-dot entry-a" />
                <div className="entry-dot entry-b" />
                <div className="callout callout-a">回踩POC后放量收回，观察多头承接</div>
              </div>
              <div className="mini-chart bearish-chart">
                <div className="zone zone-sell" />
                <div className="mini-path path-bear" />
                <div className="mini-poc lower" />
                <div className="entry-dot entry-c" />
                <div className="callout callout-b">跌破主成交区后，反弹靠近POC看压力</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="usage" className="section gold-section">
        <div className="section-title narrow">
          <p className="label">三步读图法</p>
          <h2>先定方向，再找位置，最后等市场给确认。</h2>
        </div>
        <div className="step-list">
          {steps.map(([title, body], index) => (
            <article key={title}>
              <em>{index + 1}</em>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="buy" className="buy-section">
        <div className="buy-panel">
          <div>
            <p className="label">付费指标权益</p>
            <h2>主力潮 Pro 指标包</h2>
            <p className="buy-desc">
              一次获取指标源码与完整中文说明，适合用于个人交易复盘、盘中观察和策略辅助。
            </p>
            <ul>
              {rights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <aside className="price-box">
            <span>限时体验价</span>
            <strong>¥299</strong>
            <p>包含后续小版本更新</p>
            <a href="mailto:hello@example.com?subject=购买主力潮Pro指标">联系购买</a>
          </aside>
        </div>
      </section>
    </main>
  );
}
