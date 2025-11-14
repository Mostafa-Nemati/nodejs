import { gateway4async } from "default-gateway";

export async function getNetwork() {
    try {
        const { gateway } = await gateway4async();
        return gateway
    } catch (error) {
        console.error("خطا در گرفتن IP مودم:", error);
        return null;
    }
}