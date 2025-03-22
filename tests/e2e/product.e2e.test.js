import { expect, test } from "@playwright/test";
import { generateUserData } from "../lib/userData";

test.describe.parallel("Product Tests", () => {
  const productName = "Blue Top";

  test("should verify all products and product details page", async ({
    page,
  }) => {
    const productPrice = "Rs. 500";
    const productImage = "/get_product_picture/1";

    await test.step("Navigate to Home Page", async () => {
      await page.goto("/");
      await expect(page).toHaveTitle(/Automation Exercise/i);
    });

    await test.step("Navigate to the Product page", async () => {
      await page.getByRole("link", { name: "Product" }).first().click();
      await expect(
        page.getByRole("heading", { name: "All Products" })
      ).toBeVisible();
    });

    await test.step("Verify product list is visible", async () => {
      const products = await page.locator(".productinfo").all();
      await expect(products[0].getByRole("img")).toHaveAttribute(
        "src",
        productImage
      );
      await expect(
        products[0].getByRole("heading", { name: productPrice })
      ).toBeVisible();
      await expect(
        products[0].getByRole("paragraph").filter({ hasText: productName })
      ).toBeVisible();

      expect(products.length).toBeGreaterThan(0);
      for (const product of products) {
        await expect(product).toBeVisible();
      }
    });

    await test.step("Navigate to the first product's details page", async () => {
      await page.getByRole("link", { name: "View Product" }).first().click();
      await expect(page).toHaveTitle(/Product Details/i);
    });

    await test.step("Verify product details are visible", async () => {
      await expect(
        page.getByRole("heading", { name: productName })
      ).toBeVisible();
      await expect(page.getByText("Category: Women > Tops")).toBeVisible();
      await expect(page.getByText(productPrice)).toBeVisible();
      await expect(page.getByText("Availability: In Stock")).toBeVisible();
      await expect(page.getByText("Condition: New")).toBeVisible();
      await expect(page.getByText("Brand: Polo")).toBeVisible();
      await expect(
        page.locator(".view-product").getByRole("img")
      ).toHaveAttribute("src", productImage);
    });
  });

  test("should search for a product", async ({ page }) => {
    await test.step("Navigate to Home Page", async () => {
      await page.goto("/");
      await expect(page).toHaveTitle(/Automation Exercise/i);
    });

    await test.step("Navigate to the Product page", async () => {
      await page.getByRole("link", { name: "Product" }).first().click();
      await expect(
        page.getByRole("heading", { name: "All Products" })
      ).toBeVisible();
    });

    await test.step("Search for the product", async () => {
      await page
        .getByRole("textbox", { name: "Search Product" })
        .fill(productName);
      await page.locator("#submit_search").click();
      await expect(
        page.getByRole("heading", { name: "Searched Products" })
      ).toBeVisible();
    });

    await test.step("Verify search results are relevant", async () => {
      const products = await page.locator(".productinfo").all();
      expect(products.length).toBeGreaterThan(0);
      for (const product of products) {
        await expect(product).toBeVisible();
        await expect(
          product.getByRole("paragraph").filter({ hasText: productName })
        ).toBeVisible();
      }
    });
  });

  test("should view category products", async ({ page }) => {
    let categories;

    await test.step("Navigate to Home Page", async () => {
      await page.goto("/");
      await expect(page).toHaveTitle(/Automation Exercise/i);
    });

    await test.step("Ensure categories are visible on left", async () => {
      await expect(
        page.getByRole("heading", { name: "Category" })
      ).toBeVisible();
      categories = await page
        .locator(".category-products")
        .getByRole("link")
        .all();

      expect(categories).toHaveLength(3);
      for (const category of categories) {
        await expect(category).toBeVisible();
      }
    });

    const subcategories = {
      women: ["Dress", "Saree"],
      men: ["Jeans"],
      kids: [],
    };

    for (const category of categories) {
      let categoryName = await category.textContent();
      categoryName = categoryName.toLowerCase().trim();
      for (const subcategory of subcategories[categoryName]) {
        await test.step(`View ${categoryName} category ${subcategory} products`, async () => {
          await category.click();
          await page.getByRole("link", { name: subcategory }).click();
          await expect(
            page.getByRole("heading", {
              name: `${categoryName.toUpperCase()} - ${subcategory.toUpperCase()} PRODUCTS`,
            })
          ).toBeVisible();

          const products = await page.locator(".productinfo").all();
          expect(products.length).toBeGreaterThan(0);
          for (const product of products) {
            await expect(product).toBeVisible();
            await expect(
              product.getByRole("paragraph").filter({ hasText: subcategory })
            ).toBeVisible();
          }
        });
      }
    }
  });

  test("should view brand product details", async ({ page }) => {
    let brands;
    await test.step("Navigate to Home Page", async () => {
      await page.goto("/");
      await expect(page).toHaveTitle(/Automation Exercise/i);
    });

    await test.step("Navigate to the Product page", async () => {
      await page.getByRole("link", { name: "Product" }).first().click();
      await expect(
        page.getByRole("heading", { name: "All Products" })
      ).toBeVisible();
    });

    await test.step("Ensure brands are visible on left", async () => {
      await expect(page.getByRole("heading", { name: "Brands" })).toBeVisible();
      brands = await page.locator(".brands-name").getByRole("link").all();

      expect(brands).toHaveLength(8);
      for (const brand of brands) {
        await expect(brand).toBeVisible();
      }
    });

    for (const brand of brands) {
      let brandName = await brand.innerText();
      brandName = brandName.trim().split("\n").pop().toLowerCase();
      await test.step(`View ${brandName} brand products`, async () => {
        await brand.click();
        await expect(
          page.getByRole("heading", {
            name: `BRAND - ${brandName.toUpperCase()} PRODUCTS`,
          })
        ).toBeVisible();

        await page.getByRole("link", { name: "View Product" }).first().click();
        await expect(page.getByText(`Brand: ${brandName}`)).toBeVisible();
      });
    }
  });

  test("should add review to product", async ({ page }) => {
    await test.step("Navigate to Home Page", async () => {
      await page.goto("/");
      await expect(page).toHaveTitle(/Automation Exercise/i);
    });

    await test.step("Navigate to the Product page", async () => {
      await page.getByRole("link", { name: "Product" }).first().click();
      await expect(
        page.getByRole("heading", { name: "All Products" })
      ).toBeVisible();
    });

    await test.step("Navigate to the first product's details page", async () => {
      await page.getByRole("link", { name: "View Product" }).first().click();
      await expect(page).toHaveTitle(/Product Details/i);
    });

    await test.step("Add review to the product", async () => {
      const userData = generateUserData();

      await expect(
        page.getByRole("link", { name: "Write Your Review" })
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Thank you for your review." })
      ).toBeHidden();

      await page
        .getByRole("textbox", { name: "Your Name" })
        .fill(`${userData.firstName} ${userData.lastName}`);
      await page
        .getByRole("textbox", { name: "Email Address", exact: true })
        .fill(userData.email);
      await page
        .getByRole("textbox", { name: "Add Review Here!" })
        .fill("This is a test review");

      await page.getByRole("button", { name: "Submit" }).click();
      await expect(page.getByText("Thank you for your review.")).toBeVisible();
    });
  });
});
