
<template>
    <p>
        {{ address }}
    </p>
</template>

<script>
export default {

    props: {
        address: { type: Object, default: undefined }
    }
}
</script>