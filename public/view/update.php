<script>
    if(!localStorage.updateTime) {
        localStorage.updateTime = 1;
        updateCache();
    } else {
        localStorage.removeItem("updateTime");
        location.href = HOME;
    }
</script>
