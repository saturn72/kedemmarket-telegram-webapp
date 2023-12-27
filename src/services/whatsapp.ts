import type { Order } from "~/models/cart";

function startChatInternal(message: string): void {
    const te = encodeURIComponent(message);
    const link = `https://wa.me/${useAppConfig().defaults.whatsappPhone}?text=${te}`

    navigateTo(link, {
        external: true,
        open: {
            target: '_blank',
        }
    })

}

export function startChat() {
    startChatInternal(useNuxtApp().$t("beginChatMessage"));
}

export function sendOrderToChat(order: Order) {
    const $t = useNuxtApp().$t;
    let text = `*${$t('kedemmarket')}*\n${$t('orderNumber')}\t*${order.orderId}*\n\n`;

    let i = 1;
    order.items.forEach(x => {
        text += `${i++}.\t${x.product.name}\t${x.orderedQuantity} ${$t('units')}\t${$t('itemTotal')} ${x.priceAfterDiscounts}\n`
    });
    const { store, accountOrders } = useAppConfig().routes;
    text += `\n\n*${$t('orderLink')}:* ${store}${accountOrders}/${order.orderId}`

    startChatInternal(text);
}
