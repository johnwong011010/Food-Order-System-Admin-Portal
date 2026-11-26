<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type Availability = 'Available' | 'Sold out'

interface FoodItem {
	id: string
	name: string
	category: string
	price: number
	availability: Availability
	description: string
}

type FoodItemForm = Omit<FoodItem, 'id'>

const storageKey = 'food-order-admin-items'
const defaultItems: FoodItem[] = [
	{ id: 'item-1', name: 'Margherita Pizza', category: 'Pizza', price: 14.5, availability: 'Available', description: 'Tomato, mozzarella, and fresh basil.' },
	{ id: 'item-2', name: 'Classic Cheeseburger', category: 'Burgers', price: 12, availability: 'Available', description: 'Grilled beef, cheddar, lettuce, and house sauce.' },
	{ id: 'item-3', name: 'Creamy Mushroom Pasta', category: 'Pasta', price: 16, availability: 'Sold out', description: 'Penne in a creamy mushroom sauce.' },
	{ id: 'item-4', name: 'Garden Salad', category: 'Salads', price: 9.5, availability: 'Available', description: 'Seasonal greens, cucumber, tomato, and vinaigrette.' },
	{ id: 'item-5', name: 'Crispy Chicken Burger', category: 'Burgers', price: 13.5, availability: 'Available', description: 'Crispy chicken, slaw, and pickles.' },
	{ id: 'item-6', name: 'Four Cheese Pizza', category: 'Pizza', price: 17, availability: 'Available', description: 'Mozzarella, gorgonzola, parmesan, and fontina.' },
]

function loadItems(): FoodItem[] {
	try {
		const savedItems = localStorage.getItem(storageKey)
		if (!savedItems) return defaultItems

		const parsedItems: unknown = JSON.parse(savedItems)
		return Array.isArray(parsedItems) ? parsedItems as FoodItem[] : defaultItems
	} catch {
		return defaultItems
	}
}

function emptyForm(): FoodItemForm {
	return {
		name: '',
		category: '',
		price: 0,
		availability: 'Available',
		description: '',
	}
}

const items = ref<FoodItem[]>(loadItems())
const searchQuery = ref('')
const categoryFilter = ref('All categories')
const availabilityFilter = ref('All statuses')
const isDialogOpen = ref(false)
const editingId = ref<string | null>(null)
const form = ref<FoodItemForm>(emptyForm())

const categories = computed(() => [...new Set(items.value.map((item) => item.category))].sort())
const availableCount = computed(() => items.value.filter((item) => item.availability === 'Available').length)
const soldOutCount = computed(() => items.value.length - availableCount.value)
const filteredItems = computed(() => {
	const query = searchQuery.value.trim().toLowerCase()

	return items.value.filter((item) => {
		const matchesSearch = !query || `${item.name} ${item.category}`.toLowerCase().includes(query)
		const matchesCategory = categoryFilter.value === 'All categories' || item.category === categoryFilter.value
		const matchesAvailability = availabilityFilter.value === 'All statuses' || item.availability === availabilityFilter.value
		return matchesSearch && matchesCategory && matchesAvailability
	})
})

watch(items, (updatedItems) => {
	try {
		localStorage.setItem(storageKey, JSON.stringify(updatedItems))
	} catch {
		// Keep editing available if browser storage is disabled or full.
	}
}, { deep: true })

function openCreateDialog() {
	editingId.value = null
	form.value = emptyForm()
	isDialogOpen.value = true
}

function openEditDialog(item: FoodItem) {
	editingId.value = item.id
	form.value = { ...item }
	isDialogOpen.value = true
}

function closeDialog() {
	isDialogOpen.value = false
}

function saveItem() {
	const itemData = {
		...form.value,
		name: form.value.name.trim(),
		category: form.value.category.trim(),
		description: form.value.description.trim(),
		price: Number(form.value.price),
	}

	if (editingId.value) {
		const itemIndex = items.value.findIndex((item) => item.id === editingId.value)
		if (itemIndex !== -1) items.value[itemIndex] = { ...itemData, id: editingId.value }
	} else {
		items.value.unshift({ ...itemData, id: `item-${Date.now()}` })
	}

	closeDialog()
}

function deleteItem(item: FoodItem) {
	if (window.confirm(`Delete "${item.name}" from the menu?`)) {
		items.value = items.value.filter((currentItem) => currentItem.id !== item.id)
	}
}

function formatPrice(price: number) {
	return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}
</script>

<template>
	<main class="food-page">
		<div class="page-heading">
			<div>
				<p class="eyebrow">Menu management</p>
				<h2>Food items</h2>
				<p class="page-description">Manage your menu, prices, and availability.</p>
			</div>
			<button class="primary-button" type="button" @click="openCreateDialog">
				<span aria-hidden="true">+</span> Add food item
			</button>
		</div>

		<section class="summary-grid" aria-label="Food item summary">
			<article class="summary-item">
				<span class="summary-mark total-mark" aria-hidden="true">M</span>
				<div><p>Total menu items</p><strong>{{ items.length }}</strong></div>
			</article>
			<article class="summary-item">
				<span class="summary-mark available-mark" aria-hidden="true">A</span>
				<div><p>Available</p><strong>{{ availableCount }}</strong></div>
			</article>
			<article class="summary-item">
				<span class="summary-mark sold-mark" aria-hidden="true">S</span>
				<div><p>Sold out</p><strong>{{ soldOutCount }}</strong></div>
			</article>
		</section>

		<section class="menu-panel" aria-labelledby="menu-list-title">
			<div class="panel-heading">
				<div>
					<h3 id="menu-list-title">Menu catalogue</h3>
					<p>{{ filteredItems.length }} {{ filteredItems.length === 1 ? 'item' : 'items' }}</p>
				</div>
				<div class="filters">
					<label class="search-box">
						<span class="sr-only">Search food items</span>
						<span class="search-icon" aria-hidden="true"></span>
						<input v-model="searchQuery" type="search" placeholder="Search menu...">
					</label>
					<label>
						<span class="sr-only">Filter by category</span>
						<select v-model="categoryFilter">
							<option>All categories</option>
							<option v-for="category in categories" :key="category">{{ category }}</option>
						</select>
					</label>
					<label>
						<span class="sr-only">Filter by availability</span>
						<select v-model="availabilityFilter">
							<option>All statuses</option>
							<option>Available</option>
							<option>Sold out</option>
						</select>
					</label>
				</div>
			</div>

			<div class="table-scroll">
				<table>
					<thead>
						<tr>
							<th scope="col">Food item</th>
							<th scope="col">Category</th>
							<th scope="col">Price</th>
							<th scope="col">Availability</th>
							<th scope="col"><span class="sr-only">Actions</span></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in filteredItems" :key="item.id">
							<td>
								<div class="item-name">{{ item.name }}</div>
								<div class="item-description">{{ item.description || 'No description' }}</div>
							</td>
							<td><span class="category-label">{{ item.category }}</span></td>
							<td class="price-cell">{{ formatPrice(item.price) }}</td>
							<td>
								<span class="status" :class="item.availability === 'Available' ? 'status-available' : 'status-sold-out'">
									<span class="status-dot"></span>{{ item.availability }}
								</span>
							</td>
							<td>
								<div class="row-actions">
									<button class="text-button" type="button" @click="openEditDialog(item)">Edit</button>
									<button class="text-button delete-button" type="button" @click="deleteItem(item)">Delete</button>
								</div>
							</td>
						</tr>
						<tr v-if="filteredItems.length === 0">
							<td class="empty-state" colspan="5">
								<strong>No food items found</strong>
								<span>Try changing the search or filters, or add a new menu item.</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>

		<div v-if="isDialogOpen" class="dialog-backdrop" @click.self="closeDialog" @keydown.esc.window="closeDialog">
			<section class="item-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
				<div class="dialog-heading">
					<div>
						<p class="eyebrow">Menu catalogue</p>
						<h3 id="dialog-title">{{ editingId ? 'Edit food item' : 'Add food item' }}</h3>
					</div>
					<button class="close-button" type="button" aria-label="Close dialog" @click="closeDialog">×</button>
				</div>

				<form class="item-form" @submit.prevent="saveItem">
					<label class="form-field">
						<span>Item name</span>
						<input v-model="form.name" type="text" placeholder="e.g. Margherita Pizza" required maxlength="80" autofocus>
					</label>
					<div class="form-row">
						<label class="form-field">
							<span>Category</span>
							<input v-model="form.category" type="text" list="food-categories" placeholder="e.g. Pizza" required maxlength="40">
							<datalist id="food-categories">
								<option v-for="category in categories" :key="category" :value="category" />
							</datalist>
						</label>
						<label class="form-field">
							<span>Price (USD)</span>
							<input v-model.number="form.price" type="number" min="0" step="0.01" required>
						</label>
					</div>
					<label class="form-field">
						<span>Availability</span>
						<select v-model="form.availability">
							<option>Available</option>
							<option>Sold out</option>
						</select>
					</label>
					<label class="form-field">
						<span>Description <small>Optional</small></span>
						<textarea v-model="form.description" rows="3" maxlength="180" placeholder="Describe the ingredients or dish."></textarea>
					</label>
					<div class="dialog-actions">
						<button class="secondary-button" type="button" @click="closeDialog">Cancel</button>
						<button class="primary-button" type="submit">{{ editingId ? 'Save changes' : 'Add item' }}</button>
					</div>
				</form>
			</section>
		</div>
	</main>
</template>

<style scoped>
.food-page {
	flex: 1;
	width: 100%;
	min-width: 0;
	box-sizing: border-box;
	padding: clamp(20px, 3vw, 40px);
	color: #202a32;
	background: #f3f6f4;
	text-align: left;
}

.page-heading,
.panel-heading,
.dialog-heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20px;
}

.page-heading {
	margin-bottom: 24px;
}

.eyebrow {
	margin: 0 0 6px;
	color: #bd5b3e;
	font-size: 0.72rem;
	font-weight: 750;
	letter-spacing: 0.08em;
	text-transform: uppercase;
}

.page-heading h2,
.dialog-heading h3 {
	margin: 0;
	color: #202a32;
	font-size: 1.65rem;
	font-weight: 700;
}

.page-description,
.panel-heading p {
	margin: 5px 0 0;
	color: #718078;
	font-size: 0.9rem;
}

.primary-button,
.secondary-button {
	display: inline-flex;
	min-height: 42px;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 0 16px;
	border: 1px solid transparent;
	border-radius: 6px;
	font: inherit;
	font-size: 0.88rem;
	font-weight: 650;
	cursor: pointer;
	transition: background 150ms ease, border-color 150ms ease;
}

.primary-button {
	background: #176b58;
	color: #fff;
}

.primary-button:hover {
	background: #105544;
}

.primary-button span {
	font-size: 1.2rem;
	line-height: 1;
}

.secondary-button {
	border-color: #d7dfd9;
	background: #fff;
	color: #394740;
}

.secondary-button:hover {
	background: #f3f6f4;
}

.summary-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 14px;
	margin-bottom: 22px;
}

.summary-item {
	display: flex;
	min-height: 96px;
	align-items: center;
	gap: 14px;
	padding: 18px;
	border: 1px solid #e3e9e4;
	border-radius: 7px;
	background: #fff;
}

.summary-mark {
	display: grid;
	width: 42px;
	height: 42px;
	flex: 0 0 auto;
	place-items: center;
	border-radius: 6px;
	font-size: 0.9rem;
	font-weight: 750;
}

.total-mark {
	background: #e8f1ed;
	color: #176b58;
}

.available-mark {
	background: #eaf3e9;
	color: #4a7b42;
}

.sold-mark {
	background: #fbede8;
	color: #bd5b3e;
}

.summary-item p {
	margin: 0 0 4px;
	color: #718078;
	font-size: 0.83rem;
}

.summary-item strong {
	color: #202a32;
	font-size: 1.35rem;
}

.menu-panel {
	overflow: hidden;
	border: 1px solid #e3e9e4;
	border-radius: 7px;
	background: #fff;
}

.panel-heading {
	padding: 20px 22px;
	border-bottom: 1px solid #edf0ed;
}

.panel-heading h3 {
	margin: 0;
	color: #202a32;
	font-size: 1rem;
}

.panel-heading p {
	font-size: 0.8rem;
}

.filters {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 9px;
}

.filters select,
.search-box input,
.form-field input,
.form-field select,
.form-field textarea {
	width: 100%;
	min-width: 0;
	box-sizing: border-box;
	border: 1px solid #dce3dd;
	border-radius: 5px;
	background: #fff;
	color: #26332c;
	font: inherit;
	font-size: 0.85rem;
}

.filters select {
	width: auto;
	min-height: 38px;
	padding: 0 30px 0 10px;
}

.search-box {
	position: relative;
	display: flex;
	width: min(230px, 24vw);
}

.search-box input {
	min-height: 38px;
	padding: 0 10px 0 34px;
}

.search-icon {
	position: absolute;
	top: 11px;
	left: 12px;
	width: 11px;
	height: 11px;
	border: 1.5px solid #7d8981;
	border-radius: 50%;
	pointer-events: none;
}

.search-icon::after {
	position: absolute;
	right: -4px;
	bottom: -3px;
	width: 5px;
	height: 1.5px;
	background: #7d8981;
	content: '';
	transform: rotate(45deg);
}

.table-scroll {
	overflow-x: auto;
}

table {
	width: 100%;
	border-collapse: collapse;
	text-align: left;
}

th,
td {
	padding: 14px 22px;
	border-bottom: 1px solid #edf0ed;
	vertical-align: middle;
}

th {
	background: #fafbf9;
	color: #77827b;
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	white-space: nowrap;
}

td {
	color: #3a4740;
	font-size: 0.86rem;
}

tbody tr:last-child td {
	border-bottom: 0;
}

.item-name {
	color: #26332c;
	font-weight: 650;
}

.item-description {
	max-width: 360px;
	margin-top: 3px;
	overflow: hidden;
	color: #7b8780;
	font-size: 0.77rem;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.category-label {
	display: inline-block;
	padding: 4px 8px;
	border-radius: 4px;
	background: #f1f5f2;
	color: #506258;
	font-size: 0.77rem;
}

.price-cell {
	color: #26332c;
	font-variant-numeric: tabular-nums;
	font-weight: 650;
	white-space: nowrap;
}

.status {
	display: inline-flex;
	align-items: center;
	gap: 7px;
	font-size: 0.79rem;
	white-space: nowrap;
}

.status-dot {
	width: 7px;
	height: 7px;
	border-radius: 50%;
}

.status-available {
	color: #3d7650;
}

.status-available .status-dot {
	background: #4a9a62;
}

.status-sold-out {
	color: #ad5942;
}

.status-sold-out .status-dot {
	background: #d27155;
}

.row-actions {
	display: flex;
	justify-content: flex-end;
	gap: 14px;
	white-space: nowrap;
}

.text-button {
	padding: 4px 0;
	border: 0;
	background: transparent;
	color: #176b58;
	font: inherit;
	font-size: 0.82rem;
	font-weight: 650;
	cursor: pointer;
}

.text-button:hover {
	text-decoration: underline;
	text-underline-offset: 3px;
}

.delete-button {
	color: #ad5942;
}

.empty-state {
	padding: 48px 20px;
	color: #718078;
	text-align: center;
}

.empty-state strong,
.empty-state span {
	display: block;
}

.empty-state strong {
	margin-bottom: 5px;
	color: #394740;
}

.dialog-backdrop {
	position: fixed;
	z-index: 10;
	inset: 0;
	display: grid;
	place-items: center;
	padding: 20px;
	background: rgb(25 36 30 / 48%);
}

.item-dialog {
	width: min(100%, 520px);
	max-height: min(90vh, 760px);
	overflow-y: auto;
	box-sizing: border-box;
	padding: 24px;
	border: 1px solid #e3e9e4;
	border-radius: 8px;
	background: #fff;
	box-shadow: 0 18px 60px rgb(23 39 30 / 20%);
}

.dialog-heading {
	margin-bottom: 22px;
}

.dialog-heading h3 {
	font-size: 1.3rem;
}

.close-button {
	width: 34px;
	height: 34px;
	border: 1px solid #e3e9e4;
	border-radius: 5px;
	background: #fff;
	color: #536159;
	font-size: 1.3rem;
	line-height: 1;
	cursor: pointer;
}

.item-form {
	display: grid;
	gap: 16px;
}

.form-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 14px;
}

.form-field {
	display: grid;
	min-width: 0;
	gap: 7px;
	color: #394740;
	font-size: 0.83rem;
	font-weight: 650;
}

.form-field small {
	color: #89938d;
	font-size: 0.75rem;
	font-weight: 400;
}

.form-field input,
.form-field select {
	height: 42px;
	padding: 0 11px;
}

.form-field textarea {
	min-height: 88px;
	padding: 10px 11px;
	resize: vertical;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus,
.filters input:focus,
.filters select:focus {
	border-color: #31826c;
	outline: 3px solid rgb(49 130 108 / 14%);
}

.dialog-actions {
	display: flex;
	justify-content: flex-end;
	gap: 9px;
	margin-top: 6px;
	padding-top: 18px;
	border-top: 1px solid #edf0ed;
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	clip-path: inset(50%);
}

@media (max-width: 820px) {
	.panel-heading {
		align-items: flex-start;
		flex-direction: column;
	}

	.filters {
		width: 100%;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.search-box {
		width: 100%;
	}

	.filters label:has(select) {
		flex: 1;
	}

	.filters select {
		width: 100%;
	}
}

@media (max-width: 600px) {
	.food-page {
		padding: 20px 14px;
	}

	.page-heading {
		align-items: flex-start;
	}

	.page-heading h2 {
		font-size: 1.4rem;
	}

	.page-description {
		max-width: 230px;
	}

	.page-heading > .primary-button {
		min-height: 38px;
		padding: 0 10px;
		font-size: 0.78rem;
		white-space: nowrap;
	}

	.summary-grid {
		grid-template-columns: 1fr;
		gap: 8px;
	}

	.summary-item {
		min-height: 72px;
		padding: 12px 14px;
	}

	.summary-mark {
		width: 36px;
		height: 36px;
	}

	.panel-heading {
		padding: 16px;
	}

	th,
	td {
		padding: 12px 14px;
	}

	.form-row {
		grid-template-columns: 1fr;
	}

	.item-dialog {
		padding: 20px 16px;
	}
}
</style>
