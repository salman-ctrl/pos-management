import React from 'react';

// Gunakan forwardRef agar library bisa mengakses elemen DOM-nya
export const ReceiptPrint = React.forwardRef(({ data }, ref) => {
    if (!data) return null;

    const { transaction, store } = data;

    return (
        <div ref={ref} className="p-4 bg-white text-black font-mono text-[10px] w-[58mm]">
            <div className="text-center mb-2">
                {store?.logoUrl && (
                    <img src={store.logoUrl} alt="Logo" className="max-w-[35mm] mx-auto mb-2" />
                )}
                <h2 className="text-[15px] font-bold m-0">{store?.storeName || 'SAVORIA'}</h2>
                <p className="m-0 text-[9px]">{store?.address}</p>
                <p className="m-0 text-[9px]">{store?.phone}</p>
            </div>

            <div className="border-t border-dashed border-black my-2"></div>

            <div className="space-y-1">
                <div>INV : {transaction?.invoiceNumber}</div>
                <div>TGL : {new Date(transaction?.createdAt).toLocaleString('id-ID')}</div>
                <div>CUST: {transaction?.customer?.name || 'UMUM'}</div>
            </div>

            <div className="border-t border-dashed border-black my-2"></div>

            <div className="space-y-2">
                {transaction?.items?.map((item, i) => (
                    <div key={i}>
                        <div className="font-bold">{item.product?.name}</div>
                        <div className="flex justify-between">
                            <span>{item.qty} x {Number(item.price).toLocaleString('id-ID')}</span>
                            <span>{(item.qty * Number(item.price)).toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-dashed border-black my-2"></div>

            <div className="space-y-1">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{Number(transaction?.subTotal).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-bold text-[12px] mt-2">
                    <span>TOTAL</span>
                    <span>Rp {Number(transaction?.grandTotal).toLocaleString('id-ID')}</span>
                </div>
            </div>

            <div className="text-center mt-4 text-[9px]">
                <p>{store?.receiptFooter}</p>
                <p className="mt-2 opacity-30">Powered by Savoria POS</p>
            </div>
        </div>
    );
});

ReceiptPrint.displayName = 'ReceiptPrint';