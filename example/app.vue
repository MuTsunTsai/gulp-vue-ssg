<template>
	<div>
		<Hello />
		Navigator.product always returns "{{ a }}".
	</div>
</template>

<script setup lang="ts">
	// Test bundling
	import Hello from './hello.vue';

	import { ref } from 'vue';

	// Test DOM-dependent code
	const a = ref(navigator.product);
</script>
