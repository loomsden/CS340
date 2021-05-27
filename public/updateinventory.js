function updateInventory(hid, sid){
	$.ajax({
		url: "/inventory/" + hid + "/supply/" + sid,
		type: "PUT",
		data: $("#updateInventory").serialize()
	})
};
