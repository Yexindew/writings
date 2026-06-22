document.addEventListener('DOMContentLoaded', function() {

        function switchTab(name) {
          var panels = ['trend', 'fixed'];
          panels.forEach(function(p) {
            var panel = document.getElementById('tab-panel-' + p);
            var btn   = document.getElementById('tab-btn-' + p);
            if (p === name) {
              panel.style.display = 'flex';
              btn.style.background = 'var(--yellow)';
              btn.style.color = 'var(--dark)';
            } else {
              panel.style.display = 'none';
              btn.style.background = 'rgba(255,255,255,0.1)';
              btn.style.color = 'rgba(255,255,255,0.6)';
            }
          });
        }

        // ===== 图表 hover 交互 =====
        (function() {
          // 每个月份的 tooltip 数据，只有3月有内容
          var tooltipData = {
            5: {
              title: '3月小幅上涨',
              lines: [
                '• CKA覆盖增速，权限开通问题增多',
                '• 三月集中上线结账相关能力，和咨询增多'
              ]
            }
          };

          var tooltip   = document.getElementById('chart-tooltip');
          var ttTitle   = document.getElementById('tooltip-title');
          var ttBody    = document.getElementById('tooltip-body');
          var vline     = document.getElementById('hover-vline');
          var svg       = document.getElementById('trend-chart');
          var wrap      = document.getElementById('chart-wrap');

          // x 坐标映射：月份 index → SVG viewBox x
          var monthX = [48, 148, 248, 348, 448, 548, 648];

          function showTooltip(monthIdx, rectEl) {
            var data = tooltipData[monthIdx];
            if (!data) return;

            // 显示竖线
            var mx = monthX[monthIdx];
            vline.setAttribute('x1', mx);
            vline.setAttribute('x2', mx);
            vline.setAttribute('opacity', '1');

            // 填充 tooltip
            ttTitle.textContent = data.title;
            ttBody.innerHTML = data.lines.map(function(l) {
              return '<div style="margin-bottom:2px;">' + l + '</div>';
            }).join('');
            tooltip.style.display = 'block';

            // 定位 tooltip：用屏幕坐标（fixed定位，不受overflow:hidden影响）
            var svgRect  = svg.getBoundingClientRect();
            var scaleX   = svgRect.width  / 660;
            var scaleY   = svgRect.height / 280;
            var screenX  = svgRect.left + mx * scaleX;
            var screenY  = svgRect.top  + 160 * scaleY;

            // 防溢出右边
            var tw = 210;
            var left = screenX + 12;
            if (left + tw > window.innerWidth - 8) left = screenX - tw - 12;
            tooltip.style.left = left + 'px';
            tooltip.style.top  = (screenY - 40) + 'px';
          }

          function hideTooltip() {
            tooltip.style.display = 'none';
            vline.setAttribute('opacity', '0');
          }

          // 绑定悬停热区
          var zones = document.querySelectorAll('.hz');
          zones.forEach(function(rect) {
            var idx = parseInt(rect.getAttribute('data-month'), 10);
            rect.addEventListener('mouseenter', function() {
              showTooltip(idx, rect);
            });
            rect.addEventListener('mouseleave', function() {
              hideTooltip();
            });
          });
        })();
      
});
