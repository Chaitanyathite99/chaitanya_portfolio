def read_number(prompt):
    while True:
        try:
            return float(input(prompt))
        except ValueError:
            print("Please enter a valid number.")


print("DevOps Basic Operator Tasks")
print("=" * 30)

while True:
    print("\n1. Calculate total server resources")
    print("2. Calculate remaining disk space")
    print("3. Calculate deployment cost")
    print("4. Calculate average CPU usage")
    print("5. Calculate servers that fit in a cluster")
    print("6. Exit")

    choice = input("Select a task (1-6): ").strip()

    if choice == "1":
        cpu = read_number("Enter CPU cores: ")
        memory = read_number("Enter memory (GB): ")
        storage = read_number("Enter storage (GB): ")
        print(f"Total resources: {cpu + memory + storage:.2f}")

    elif choice == "2":
        disk = read_number("Enter total disk space (GB): ")
        used = read_number("Enter used disk space (GB): ")
        print(f"Remaining disk space: {disk - used:.2f} GB")

    elif choice == "3":
        servers = read_number("Enter number of servers: ")
        cost = read_number("Enter cost per server: ")
        print(f"Total deployment cost: {servers * cost:.2f}")

    elif choice == "4":
        cpu1 = read_number("Enter CPU usage for server 1 (%): ")
        cpu2 = read_number("Enter CPU usage for server 2 (%): ")
        cpu3 = read_number("Enter CPU usage for server 3 (%): ")
        print(f"Average CPU usage: {(cpu1 + cpu2 + cpu3) / 3:.2f}%")

    elif choice == "5":
        capacity = read_number("Enter cluster capacity (GB): ")
        server_size = read_number("Enter server size (GB): ")
        if server_size <= 0:
            print("Server size must be greater than zero.")
        else:
            print(f"Servers that fit: {int(capacity // server_size)}")

    elif choice == "6":
        print("Goodbye!")
        break

    else:
        print("Invalid choice. Select from 1 to 6.")
