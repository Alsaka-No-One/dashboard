new Vue({
    el: "#app",
    mounted() {
        document.body.classList.remove("loading");

        var onMouseMove = e => {
            if (!this.draggedWidget)
                return;
            this.draggedWidget.style.left = e.clientX - this.draggedOffset.x + "px";
            this.draggedWidget.style.top = e.clientY - this.draggedOffset.y + "px";
        }
        var onMouseUp = () => {
            if (this.draggedWidget)
                this.draggedWidget.classList.remove("dragged");
            [...document.getElementsByClassName("widget")].forEach(el => {
                el.onmousemove = null;
            });
            [...document.getElementsByClassName("collapsed")].forEach(el => {
                el.classList.remove("collapsed");
            });
            if (this.draggedWidget)
                this.saveOrder();
            this.draggedWidget = null;
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("touchmove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("touchend", onMouseUp);
        this.positionWidgets();
        this.loadServices();
        this.loadWidgets();
    },
    data() {
        return {
            services:           {},
            widgets:            {},
            coords:             {},
            flippedWidgetId:    null,
            selectedServiceId:  "",
            selectedWidgetId:   "",
            draggedWidget:      null,
            draggedOffset:      {x: 0, y: 0}
        };
    },
    computed: {
        selectedService() {
            return this.selectedServiceId
                ? this.services[this.selectedServiceId]
                : null;
        },
        selectedWidget() {
            return this.selectedService && this.selectedWidgetId
                ? this.selectedService.widgets[this.selectedWidgetId]
                : null;
        }
    },
    methods: {
        loadServices() {
            fetch("/api/services").then(res => res.json()).then(services => {
                Object.keys(services).forEach(name => {
                    if (!Object.keys(services[name].widgets).length)
                        delete services[name];
                });
                this.services = services;
            })
        },
        loadWidgets() {
            fetch("/api/widgets")
                .then(data => data.json())
                .then(widgets => { this.widgets = widgets; });
        },
        toggleNewPopup(show = true) {
            var [popup, overlay] = ["new-popup", "overlay"].map(
                e => document.getElementById(e)
            );

            if (show) {
                popup.classList.add("shown");
                overlay.classList.add("shown");
                return;
            }
            popup.classList.remove("shown");
            overlay.classList.remove("shown");
        },
        createWidget(data) {
            var [service, type, order] = [
                this.selectedServiceId,
                this.selectedWidgetId,
                Object.keys(this.widgets).length
            ];

            fetch("/api/widget", {
                method:     "POST",
                body:       JSON.stringify({service, type, order, data}),
                headers:    {"Content-type": "application/json; charset=UTF-8"}
            }).then(data => data.json()).then(json => {
                if (json.id)
                    Vue.set(this.widgets, json.id, {service, type, order, data});
                this.toggleNewPopup(false);
            });
        },
        updateWidget(data, widget_id) {
            fetch(`/api/widget/${widget_id}`, {
                method:     "PATCH",
                body:       JSON.stringify(data),
                headers:    {"Content-type": "application/json; charset=UTF-8"}
            })
                .then(data => data.json())
                .then(json => {
                    this.$refs.widget.find(w => w.id == widget_id).update(false);
                    this.flippedWidgetId = null;
                });
        },
        deleteWidget(id) {
            var widget = this.widgets[id];
            var order = widget.order;

            document.querySelectorAll(`[data-order='${order}']`)[0]
                .classList.add("deleted");
            setTimeout(() => {
                [...document.getElementsByClassName("deleted")].forEach(el => {
                    el.classList.remove("deleted");
                });
                Object.values(this.widgets).forEach(wdg => {
                    (wdg.order > order) && wdg.order--;
                });
                Vue.delete(this.widgets, id);
                fetch(`api/widget/${id}`, { method: "DELETE" });
                this.saveOrder();
            }, 250);
        },
        startDraggingWidget(e, widget) {
            if (e.currentTarget != e.target)
                return;
            var widgets = [...document.getElementsByClassName("widget")];
            var slots = [...document.getElementsByClassName("widget-slot")]

            this.draggedWidget  = e.currentTarget.parentNode.parentNode;
            this.draggedOffset  = {
                x: e.pageX - this.draggedWidget.offsetLeft,
                y: e.pageY - this.draggedWidget.offsetTop
            };
            this.draggedWidget.classList.add("dragged");
            widgets.forEach(el => {
                if (el == this.draggedWidget || el.classList.contains("new"))
                    return;
                el.onmousemove = e => {
                    var is_next = document.body.clientWidth > 576
                        ? e.offsetX > e.currentTarget.offsetWidth / 2
                        : e.offsetY > e.currentTarget.offsetHeight / 2;
                    var target = e.currentTarget;
                    var order = widget.order;

                    Object.values(this.widgets).forEach(wdg => {
                        (wdg.order > order) && wdg.order--;
                    });
                    widget.order = +el.dataset.order - !is_next + is_next;
                    widget.order += widget.order < 0;
                    widget.order -= widget.order >= Object.values(this.widgets).length;
                    Object.values(this.widgets).forEach(wdg => {
                        (wdg != widget && wdg.order >= widget.order) && wdg.order++;
                    });
                };
            });
        },
        positionWidgets() {
            var slots = [...document.getElementsByClassName("widget-slot")];

            if (this.draggedWidget && slots[this.draggedWidget.dataset.order]) {
                [...document.getElementsByClassName("collapsed")].forEach(el => {
                    el.classList.remove("collapsed");
                });
                slots[this.draggedWidget.dataset.order].classList.add("collapsed");
            }
            [...document.getElementsByClassName("widget")].forEach(el => {
                var order = el.dataset.order;

                if (order === undefined || el == this.draggedWidget)
                    return;
                el.style.left = slots[order].offsetLeft + "px";
                el.style.top = slots[order].offsetTop + "px";
            });
            requestAnimationFrame(this.positionWidgets.bind(this));
        },
        saveOrder() {
            let order = [];

            Object.entries(this.widgets).forEach(([id, {order: i}]) => { order[i] = id; });
            order = order.filter(Boolean);
            return fetch("api/widgets/order", {
                method: "POST",
                body: JSON.stringify({order}),
                headers: {"Content-type": "application/json; charset=UTF-8"}
            });
        }
    }
})
