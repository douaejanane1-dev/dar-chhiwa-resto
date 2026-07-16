import { beforeEach, describe, expect, it } from "vitest";
import { useCart } from "@/lib/cart-store";

const sampleItem = { menuItemId: "item-1", name: "Tagine Poulet", price: 65, image: "/img.jpg" };
const otherItem = { menuItemId: "item-2", name: "Pastilla", price: 45, image: "/img2.jpg" };

describe("cart store", () => {
  beforeEach(() => {
    useCart.setState({ lines: [], isOpen: false });
  });

  it("starts empty", () => {
    expect(useCart.getState().lines).toHaveLength(0);
    expect(useCart.getState().subtotal()).toBe(0);
    expect(useCart.getState().count()).toBe(0);
  });

  it("adds a new item and opens the drawer", () => {
    useCart.getState().add(sampleItem);
    const state = useCart.getState();
    expect(state.lines).toHaveLength(1);
    expect(state.lines[0].qty).toBe(1);
    expect(state.isOpen).toBe(true);
  });

  it("increments quantity when adding the same item twice", () => {
    useCart.getState().add(sampleItem);
    useCart.getState().add(sampleItem);
    const state = useCart.getState();
    expect(state.lines).toHaveLength(1);
    expect(state.lines[0].qty).toBe(2);
  });

  it("computes subtotal and count across multiple lines", () => {
    useCart.getState().add(sampleItem, 2);
    useCart.getState().add(otherItem, 1);
    expect(useCart.getState().subtotal()).toBe(65 * 2 + 45);
    expect(useCart.getState().count()).toBe(3);
  });

  it("removes a line item entirely when quantity is set to zero", () => {
    useCart.getState().add(sampleItem);
    useCart.getState().setQty(sampleItem.menuItemId, 0);
    expect(useCart.getState().lines).toHaveLength(0);
  });

  it("removes a line item via remove()", () => {
    useCart.getState().add(sampleItem);
    useCart.getState().add(otherItem);
    useCart.getState().remove(sampleItem.menuItemId);
    const state = useCart.getState();
    expect(state.lines).toHaveLength(1);
    expect(state.lines[0].menuItemId).toBe(otherItem.menuItemId);
  });

  it("clears all lines", () => {
    useCart.getState().add(sampleItem);
    useCart.getState().add(otherItem);
    useCart.getState().clear();
    expect(useCart.getState().lines).toHaveLength(0);
  });
});
