"use client";

import { useState } from 'react';

const stats = [
  ['结构方向', '偏强'],
  ['POC 主成交区', '18.72'],
  ['通道边界', '+3SD / -3SD'],
  ['适用周期', '15m - 1D'],
];

const features = [
  ['01', '结构不是凭感觉看', '用线性/多项式回归拟合当前价格中枢，快速判断行情是在偏强、偏弱还是结构切换。'],
  ['02', '主成交区一眼定位', 'POC 曲线标记窗口内成交最密集区域，辅助观察承接、受压和筹码重心。'],
  ['03', '偏离程度量化呈现', '+1SD 到 +3SD 通道展示价格偏离强弱，帮助避免在极端区域跟随过急。'],
  ['04', '成交量分布跟随趋势', 'Profile 不再固定在水平价格，而是围绕趋势通道统计，更适合趋势行情复盘。'],
];

const steps = [
  ['先看结构', 'Dashboard 显示偏强 / 偏弱，先判断当前行情所处的结构状态。'],
  ['再看区域', '价格处于中线、POC、+/-SD 哪个区域，用来区分均衡区、密集区和极端区。'],
  ['最后看反应', '结合 K 线与成交量，观察关键层级是否承接或受压。'],
];

const logicPanels = [
  {
    tab: '结构回归',
    badge: '绿色区域：承接观察区 / 橙色曲线：POC主成交区',
    title: '价格回到主成交区，观察是否出现承接反应。',
    desc: '当回归中线保持抬升，价格回到 POC 或 -1SD 附近时，这里不是简单的“价格便宜”，而是趋势结构里的高换手观察区。',
    cards: [
      ['1. 判断结构状态', '先看回归中线方向和 Dashboard：中线抬升代表结构偏强，中线走低代表结构偏弱。'],
      ['2. 锁定关键层级', '重点观察 POC 曲线、回归中线、+/-1SD 区域，它们是行情最容易出现反应的观察区。'],
      ['3. 等待量价反馈', '价格靠近关键层级后，不急于跟随，先观察成交变化、回收情况和受压反馈。'],
    ],
    chartMode: 'return',
    chartImage: '/logic-structure.png',
    topCallout: '靠近POC后成交增强，观察承接反馈',
    bottomCallout: '离开主成交区后，再靠近POC观察受压反馈',
  },
  {
    tab: 'POC承接',
    badge: '橙色曲线：成交最密集层 / 绿色带：反馈观察区',
    title: '价格围绕 POC 反复停留，观察主成交区的稳定性。',
    desc: 'POC 是统计窗口内换手最集中的区域。价格多次靠近该区域时，重点观察成交是否放大、波动是否收敛，以及是否出现稳定反馈。',
    cards: [
      ['1. 找到POC曲线', '先确认橙色曲线所在层级，它代表当前窗口中成交最密集的结构区域。'],
      ['2. 观察停留时间', '价格围绕 POC 停留越久，说明该区域被市场反复验证，参考价值越高。'],
      ['3. 对比成交变化', '靠近 POC 时如果成交明显变化，可以作为承接或受压反馈的辅助信息。'],
    ],
    chartMode: 'poc',
    chartImage: '/logic-poc.png',
    topCallout: 'POC附近停留时间变长，观察结构稳定性',
    bottomCallout: 'POC由密集区转为分界区，观察反馈强弱',
  },
  {
    tab: '偏离观察',
    badge: '外侧通道：偏离观察区 / 中线：结构均衡区',
    title: '价格运行到外侧通道，先识别偏离程度。',
    desc: '+2SD 到 +3SD 或 -2SD 到 -3SD 属于偏离更明显的区域。这里更适合做风险识别和节奏观察，而不是直接给结论。',
    cards: [
      ['1. 看偏离层级', '价格越靠近外侧通道，代表相对回归中枢的偏离越明显。'],
      ['2. 看是否持续', '偏离可以短暂出现，也可能沿通道延伸，需要结合中线方向判断结构背景。'],
      ['3. 看回归迹象', '当价格从外侧回到内侧层级时，再观察成交是否同步收敛或增强。'],
    ],
    chartMode: 'deviation',
    chartImage: '/logic-deviation.png',
    topCallout: '靠近外侧通道，优先识别偏离强弱',
    bottomCallout: '回到内侧层级后，观察节奏是否收敛',
  },
  {
    tab: '低量通过',
    badge: '短横线：低成交层 / 长横线：高成交层',
    title: '价格经过低成交层，观察通过速度和停留变化。',
    desc: '低成交层代表历史换手相对稀薄。价格经过这类区域时，常见特征是停留较短、变化较快，需要结合上下高成交层一起观察。',
    cards: [
      ['1. 区分高低量层', '横向 profile 越长，成交越密集；越短，代表该层历史换手更少。'],
      ['2. 观察通过速度', '经过低成交层时，如果停留很短，说明该区域结构参考较弱。'],
      ['3. 关注下一密集层', '通过低量层后，下一段高成交层通常更适合作为观察参照。'],
    ],
    chartMode: 'low-volume',
    chartImage: '/logic-low-volume.png',
    topCallout: '低成交层停留较短，观察通过节奏',
    bottomCallout: '接近下一密集层后，观察是否重新停留',
  },
];

export default function Home() {
  const [activeLogic, setActiveLogic] = useState(0);
  const logic = logicPanels[activeLogic];

  return (
    <main>
      <section className="hero">
        <nav className="nav">
          <div className="logo">主力潮 Pro</div>
          <div className="nav-links">
            <a href="#features">核心功能</a>
            <a href="#logic">实战图解</a>
            <a href="#usage">使用方法</a>
          </div>
        </nav>

        <div className="hero-inner">
          <div className="hero-copy">
            <h1>看清趋势里的主力成交区</h1>
            <p className="subtitle">
              一个指标看清趋势结构、偏离状态与主成交区，
              让盘面更适合复盘、跟踪和结构化观察。
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#logic">查看实战图解</a>
              <a className="ghost-button" href="#usage">查看使用方法</a>
            </div>
            <div className="hero-note">适合股票、期货、外汇等趋势型市场观察。</div>
          </div>

          <div id="demo" className="screen-card" aria-label="指标演示图">
            <div className="screen-top">
              <span>主力潮 Pro</span>
              <b>LIVE</b>
            </div>
            <div className="chart-area">
              <img className="hero-chart-img" src="/logic-structure.png" alt="主力潮结构回归示例图" />
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
            <h2>主力潮不是给一个孤立信号，而是帮你拆出行情观察区域。</h2>
            <p>
              先把行情放进回归通道，再看价格靠近哪一层成交量结构。
              下面用分图展示实际盘面中最常见的两类使用方式。
            </p>
          </div>

          <div className="logic-tabs" aria-label="信号分类">
            {logicPanels.map((item, index) => (
              <button
                className={index === activeLogic ? 'active' : ''}
                key={item.tab}
                onClick={() => setActiveLogic(index)}
                type="button"
              >
                {item.tab}
              </button>
            ))}
          </div>

          <div className={`logic-panel mode-${logic.chartMode}`}>
            <div className="logic-copy">
              <div className="logic-badge">{logic.badge}</div>
              <h3>{logic.title}</h3>
              <p>{logic.desc}</p>
              <div className="logic-card-list">
                {logic.cards.map(([title, body]) => (
                  <article key={title}>
                    <strong>{title}</strong>
                    <span>{body}</span>
                  </article>
                ))}
              </div>
            </div>

            <div className="logic-charts">
              <figure className="real-chart-card">
                <img src={logic.chartImage} alt="主力潮指标真实盘面示例" />
                <figcaption>{logic.topCallout}</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section id="usage" className="section gold-section">
        <div className="section-title narrow">
          <p className="label">三步读图法</p>
          <h2>先看结构，再找区域，最后等市场给反馈。</h2>
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

    </main>
  );
}
