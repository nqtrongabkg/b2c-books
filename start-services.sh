

# Hàm này sẽ kiểm tra xem dịch vụ đã khởi động thành công hay chưa
function service_is_running {
    local service_pid=$(ps aux | grep "$1" | grep -v "grep" | awk '{print $2}')
    if [ -n "$service_pid" ]; then
        return 0
    else
        return 1
    fi
}

# Hàm này sẽ chạy một dịch vụ và đợi cho đến khi dịch vụ hoàn tất khởi động hoặc gặp lỗi
function run_service {
    local service_name="$1"
    local retry_limit=3
    local retry_count=0
    while [ $retry_count -lt $retry_limit ]; do
        echo "Đang khởi động $service_name..."
        cd "$service_name"
        mvn spring-boot:run &
        local service_pid=$!
        wait $service_pid
        if service_is_running "$service_name"; then
            echo "$service_name đã khởi động thành công!"
            cd ..
            return 0
        else
            echo "Không thể khởi động $service_name. Thử lại..."
            ((retry_count++))
        fi
    done
    echo "Không thể khởi động $service_name sau $retry_limit lần thử. Dừng script."
    exit 1
}

# Khởi động các dịch vụ Spring Boot
echo "Đang khởi động các dịch vụ Spring Boot..."
cd ~/Desktop/B2C_books/booksstore
run_service "discovery-services" &
run_service "gateway-services" &
run_service "user-services" &
run_service "product-services" &
run_service "store-services" &
run_service "config-services" &
run_service "order-services" &
wait
echo "Đã khởi động tất cả các dịch vụ!"
