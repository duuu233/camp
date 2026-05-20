<script setup>
import AgreementDocument from '../../components/AgreementDocument.vue'
import { agreementDocuments } from '../../data/agreementContent.js'
</script>

<template>
  <AgreementDocument :document="agreementDocuments.privacy" />
</template>
