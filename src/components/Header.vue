<template>
  <header class="header">
    <div class="brand">
      <div class="logo" aria-hidden="true">🍽️</div>
      <div class="title-group">
        <h1>Food Order System Admin Portal</h1>
        <p>Manage menu, tables, and user roles</p>
      </div>
    </div>

    <nav class="nav-actions" aria-label="Admin functions">
      <button type="button">FoodItem</button>
      <button type="button">Table Setting</button>
      <button type="button">Role configuration</button>
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: linear-gradient(135deg, #1f2937, #4f46e5);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  font-size: 24px;
}

.title-group h1 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
}

.title-group p {
  margin: 2px 0 0;
  font-size: 0.9rem;
  opacity: 0.85;
}

.nav-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  background: #ffffff;
  color: #4f46e5;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}
</style>