import json
import os
import time


FILE_NAME = "products.json"

print("========================================")
print(" Product discount updater")
print("========================================")
print()

# Find products.json in the same folder as this script
script_folder = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_folder, FILE_NAME)

print(f"Script folder:")
print(f"  {script_folder}")
print()

print(f"Looking for:")
print(f"  {file_path}")
print()

input("Press ENTER to read the file...")

# Check that the file exists
if not os.path.exists(file_path):
    print()
    print("ERROR: products.json was not found!")
    print(f"Expected it at:")
    print(f"  {file_path}")
    input("\nPress ENTER to exit...")
    raise SystemExit


print("File found!")
print()

# Read the JSON
with open(file_path, "r", encoding="utf-8") as file:
    data = json.load(file)

print("JSON loaded successfully.")
print()

# Check products
products = data.get("products", [])

print(f"Found {len(products)} products.")
print()

if not products:
    print("ERROR: No products found in data['products']")
    input("\nPress ENTER to exit...")
    raise SystemExit


print("First few discounts BEFORE:")
for product in products[:10]:
    print(
        f"  ID {product.get('id')}: "
        f"{product.get('discountPercentage')}%"
    )

print()

input("Press ENTER to modify the discounts...")

print()
print("Updating discounts...")
print("----------------------------------------")

# Modify discounts
for index, product in enumerate(products):

    old_discount = product.get("discountPercentage", 0)

    if index % 2 == 0:
        # Round to nearest 5
        new_discount = round(old_discount / 5) * 5
    else:
        # Set every second discount to 0
        new_discount = 0

    product["discountPercentage"] = new_discount

    print(
        f"Product {product.get('id')}: "
        f"{old_discount}% -> {new_discount}%"
    )

    # Small delay so you can actually see it happening
    time.sleep(0.05)


print()
print("All products modified.")
print()

input("Press ENTER to write the changes to products.json...")

# Write the JSON back
with open(file_path, "w", encoding="utf-8") as file:
    json.dump(data, file, indent=2, ensure_ascii=False)

    # Make absolutely sure everything is flushed to disk
    file.flush()
    os.fsync(file.fileno())


print()
print("========================================")
print(" FILE WRITTEN SUCCESSFULLY")
print("========================================")
print()
print(f"Written to:")
print(f"  {file_path}")
print()

print("First few discounts AFTER:")
for product in products[:10]:
    print(
        f"  ID {product.get('id')}: "
        f"{product.get('discountPercentage')}%"
    )

print()
print("The file has been saved.")
print()

input("Press ENTER to exit...")