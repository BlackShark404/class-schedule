<template>
  <div>
    <h2 class="section-title">Fee Breakdown</h2>
    <div class="fees-container">
      <div class="fees-list">
        <div v-for="fee in fees" :key="fee.name" class="fee-item">
          <span class="fee-name">{{ fee.name }}</span>
          <span class="fee-amount">{{ formatCurrency(fee.amount) }}</span>
        </div>
        <div class="fee-item fee-total">
          <span class="fee-name">Total Charges</span>
          <span class="fee-amount">{{ formatCurrency(totalFees) }}</span>
        </div>
      </div>
      <div class="fees-summary">
        <div class="total-card">
          <div class="total-card-label">Total Charges</div>
          <div class="total-card-value">{{ totalFees.toLocaleString() }}</div>
          <div class="total-card-currency">Philippine Peso (₱)</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Units</div>
          <div class="stat-value accent-2">{{ totalUnits.toFixed(2) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Cost per Unit</div>
          <div class="stat-value accent-3">₱{{ costPerUnit.toFixed(2) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fees, totalFees, totalUnits, costPerUnit, formatCurrency } from '../../data/schedule.js'
</script>
