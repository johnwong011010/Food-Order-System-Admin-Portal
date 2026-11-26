<template>
  <main class="dashboard">
    <section class="hero">
      <div>
        <p class="eyebrow">Overview</p>
        <h2>Admin Dashboard</h2>
        <p>Track live table occupancy and top food item performance.</p>
      </div>
      <div class="status-pill">Live updates</div>
    </section>

    <section class="stats-grid">
      <article class="card">
        <h3>Tables Occupied</h3>
        <div class="metric">18 / 24</div>
        <div class="progress-bar">
          <span style="width: 75%"></span>
        </div>
      </article>

      <article class="card">
        <h3>Today Orders</h3>
        <div class="metric">126</div>
        <p class="subtext">+12% compared to yesterday</p>
      </article>

      <article class="card">
        <h3>Popular Dish</h3>
        <div class="metric">Pizza</div>
        <p class="subtext">42 orders today</p>
      </article>
    </section>

    <section class="charts-grid">
      <article class="card chart-card">
        <div class="card-header">
          <h3>Table Status</h3>
          <span class="badge">Busy / Free</span>
        </div>

        <div class="chart-wrap">
          <div class="donut-chart"></div>
          <ul class="legend">
            <li><span class="dot occupied"></span>Occupied 18</li>
            <li><span class="dot available"></span>Available 6</li>
          </ul>
        </div>
      </article>

      <article class="card chart-card">
        <div class="card-header">
          <h3>Food Item Statistics</h3>
          <span class="badge">Top sellers</span>
        </div>

        <div class="food-stats">
          <div class="food-row">
            <span>Pizza</span>
            <div class="bar"><span style="width: 85%"></span></div>
            <strong>42</strong>
          </div>
          <div class="food-row">
            <span>Burger</span>
            <div class="bar"><span style="width: 65%"></span></div>
            <strong>32</strong>
          </div>
          <div class="food-row">
            <span>Pasta</span>
            <div class="bar"><span style="width: 48%"></span></div>
            <strong>24</strong>
          </div>
          <div class="food-row">
            <span>Salad</span>
            <div class="bar"><span style="width: 35%"></span></div>
            <strong>18</strong>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.dashboard {
  flex: 1;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: clamp(16px, 2.4vw, 32px);
  background: #f5f7fb;
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.eyebrow {
  margin: 0 0 6px;
  color: #4f46e5;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
}

h2 {
  margin: 0;
  color: #111827;
}

.hero p {
  margin: 6px 0 0;
  color: #6b7280;
}

.status-pill,
.badge {
  padding: 8px 12px;
  border-radius: 999px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 0.85rem;
  font-weight: 600;
}

.stats-grid,
.charts-grid {
  display: grid;
  gap: 16px;
  margin-bottom: 16px;
}

.stats-grid {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.charts-grid {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.card {
  background: white;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.card h3 {
  margin: 0 0 10px;
  color: #111827;
}

.metric {
  font-size: 1.7rem;
  font-weight: 700;
  color: #111827;
}

.subtext {
  margin-top: 6px;
  color: #6b7280;
}

.progress-bar {
  margin-top: 12px;
  width: 100%;
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #4f46e5, #22c55e);
  border-radius: inherit;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.chart-wrap {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.donut-chart {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(#4f46e5 0 75%, #22c55e 75% 100%);
  position: relative;
}

.donut-chart::after {
  content: '';
  position: absolute;
  inset: 20px;
  background: white;
  border-radius: 50%;
}

.legend {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
  color: #374151;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.dot.occupied {
  background: #4f46e5;
}

.dot.available {
  background: #22c55e;
}

.food-stats {
  display: grid;
  gap: 12px;
}

.food-row {
  display: grid;
  grid-template-columns: 70px 1fr 40px;
  gap: 10px;
  align-items: center;
  color: #374151;
}

.bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #fb923c);
  border-radius: inherit;
}

#app {
  width: 100%;
  max-width: none;
  /* 保留其餘既有樣式 */
}
</style>