"use client";

import { useState } from 'react';

const stats = [
  ['回归模式', '线性 / 多项式'],
  ['POC 主成交区', '最高换手层'],
  ['动态SR', '量能突变层'],
  ['偏离通道', '+1SD ~ +3SD'],
];

const features = [
  ['01', '趋势中枢可视化', '用线性或多项式回归拟合当前窗口的价格中枢，先看结构倾斜与节奏背景。'],
  ['02', '主成交区一眼定位', 'POC 曲线标记窗口内成交最密集的通道层，辅助观察换手重心与区域反馈。'],
  ['03', '动态SR自动提取', '从回归相对量能桶中识别成交突变层，生成随趋势弯曲的支撑阻力参考线。'],
  ['04', '偏离程度量化呈现', '+1SD 到 +3SD 通道展示相对中枢的偏离层级，方便做风险与节奏观察。'],
];

const steps = [
  ['先定结构', '观察回归中线方向与弯曲程度，判断当前窗口是延续、放缓还是结构切换。'],
  ['再找层级', '把 POC、动态SR、标准差通道放在一起看，区分主成交区、突变量能层和偏离区。'],
  ['最后等反馈', '价格靠近关键层级后，观察停留时间、成交变化和回到通道内外的节奏。'],
];

const logicPanels = [
  {
    tab: '结构回归',
    badge: '黑色虚线：回归中枢 / 灰色通道：标准差边界',
    title: '先看行情是否沿着同一条结构中枢运行。',
    desc: '回归线代表当前窗口的结构中枢，多项式模式会跟随节奏弯曲。它不单独给结论，而是先把盘面放回一条可观察的趋势坐标里。',
    cards: [
      ['1. 看中线方向', '中线向上、向下或走平，分别代表不同的结构背景，后面的 POC 和 SR 都要放在这个背景下理解。'],
      ['2. 看通道宽度', '标准差通道越宽，说明当前窗口波动越大；通道收窄时，说明节奏相对集中。'],
      ['3. 看价格位置', '价格在中线附近、外侧通道或主成交区附近，代表完全不同的观察语境。'],
    ],
    chartMode: 'return',
    chartImage: '/logic-structure.png',
    topCallout: '回归中枢用于判断当前窗口的结构方向与节奏位置',
    bottomCallout: '通道边界用于衡量相对中枢的偏离程度',
  },
  {
    tab: 'POC承接',
    badge: '橙色曲线：成交最密集层 / 绿色带：反馈观察区',
    title: '价格围绕 POC 反复停留，观察主成交区是否稳定。',
    desc: 'POC 是当前回归窗口内换手最集中的通道层。价格靠近它时，重点看停留时间、成交变化，以及是否在该区域形成明显反馈。',
    cards: [
      ['1. 找到POC曲线', '先确认橙色曲线所在层级，它代表当前窗口中成交最密集的结构区域。'],
      ['2. 观察停留时间', '围绕 POC 停留越久，说明这一区域被反复换手，结构参考价值更高。'],
      ['3. 对比成交变化', '靠近 POC 时如果成交明显变化，可以作为区域反馈强弱的辅助信息。'],
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
    desc: '+2SD 到 +3SD 或 -2SD 到 -3SD 属于偏离更明显的区域。这里更适合做风险识别、节奏放缓和回归观察，而不是直接给单一结论。',
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
    desc: '低成交层代表当前窗口内历史换手相对稀薄。价格经过这类区域时，常见特征是停留较短、变化较快，需要结合上下高成交层和动态SR一起观察。',
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
  {
    tab: '动态SR',
    badge: '红色曲线：动态支撑阻力 / 标签：SR参考价格',
    title: '从量能突变层中提取随趋势弯曲的关键参照线。',
    desc: '动态SR不是固定水平线，而是围绕回归中枢计算成交量突变层，再沿着趋势结构绘制出来。它更适合观察行情靠近关键量能层时的反馈。',
    cards: [
      ['1. 看SR数量', '默认最多显示少量关键线，数量越少越聚焦，避免盘面被过多层级干扰。'],
      ['2. 看是否贴近POC', 'SR 与 POC 或标准差层重合时，说明该区域同时具备换手密集和结构参照意义。'],
      ['3. 看触达反馈', '靠近 SR 后重点观察停留、回收、波动放大或收敛，而不是把它当作固定结论。'],
    ],
    chartMode: 'sr',
    chartImage: '/logic-poc.png',
    topCallout: '动态SR来自量能突变层，会跟随回归结构弯曲',
    bottomCallout: '与POC、SD层叠加观察，参考价值更完整',
  },
];

export default function Home() {
  const [activeLogic, setActiveLogic] = useState(0);
  const logic = logicPanels[activeLogic];

  return (
    <main>
      <section className="hero">
        <nav className="nav">
          <div className="logo">主力溯源</div>
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
              一个指标看清趋势结构、偏离状态、主成交区与动态SR，
              让盘面更适合复盘、跟踪和结构化观察。
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#logic">查看实战图解</a>
              <a className="ghost-button" href="#usage">查看使用方法</a>
            </div>
            <div className="hero-note">适合贵金属、外汇、期货、股票等趋势型市场观察。</div>
          </div>

          <div id="demo" className="screen-card" aria-label="指标演示图">
            <div className="screen-top">
              <span>主力溯源</span>
              <b>LIVE</b>
            </div>
            <div className="chart-area">
              <img className="hero-chart-img" src="/logic-structure.png" alt="主力溯源结构回归示例图" />
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
          <h2>它看的是“趋势通道里的成交量与关键层级”，不是静态价格。</h2>
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
            <h2>主力溯源不是给一个孤立信号，而是帮你拆出行情观察区域。</h2>
            <p>
              先把行情放进回归通道，再看价格靠近哪一层成交量结构。
              下面用分图展示实际盘面中最常见的使用方式。
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
                <img src={logic.chartImage} alt="主力溯源指标真实盘面示例" />
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
